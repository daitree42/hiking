// Cloudflare Worker: 代理 DeepSeek API 调用
// 部署后设置 DEEPSEEK_API_KEY 环境变量

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response("Server configuration error", { status: 500 });
    }

    try {
      // 前端发来的是 Anthropic 格式，需要转为 OpenAI/DeepSeek 格式
      const body = await request.json();

      // 转换 messages：Anthropic 的 system 字段 → 作为第一条 system message
      const deepseekMessages = [];
      if (body.system) {
        deepseekMessages.push({ role: "system", content: body.system });
      }
      if (body.messages) {
        deepseekMessages.push(...body.messages);
      }

      const deepseekBody = {
        model: "deepseek-chat",
        messages: deepseekMessages,
        max_tokens: body.max_tokens || 1500,
        temperature: 0.3,
      };

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(deepseekBody),
      });

      const data = await response.json();

      // 将 DeepSeek 响应转回 Anthropic 格式，前端无须改动
      const anthropicResponse = {
        content: [
          {
            text: data.choices?.[0]?.message?.content || "",
          },
        ],
      };

      return new Response(JSON.stringify(anthropicResponse), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};

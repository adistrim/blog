---
title: Why I built a web search library
subtitle: Notes from building a Go search core for JS
date: 29-12-2025
readtime: 3 min
---

I was working on a side project where I needed to add basic web search capability to an AI agent. When I looked around, I noticed most projects rely on existing search APIs like Bing, Google, Perplexity, Brave, etc.

For my use case, that felt like overkill. I did not need ranking dashboards or large-scale indexing, and honestly I did not want to pay for it. A friend jokingly said, “Why don’t you just send a curl request to Google and parse the HTML?” It sounded dumb at first, but the idea itself was not completely wrong.

The real issue is that Google has very strong protections and the markup changes often. That makes it unreliable.

So I chose DuckDuckGo. It has a `html.duckduckgo.com` endpoint that returns stable, JS-free HTML. DuckDuckGo provides this for text-only browsers, accessibility tools, and low-bandwidth use cases. It is predictable and easy to parse.

So I built the core functionality in Go. The core does two things:

* Sends requests to `html.duckduckgo.com` and parses the HTML to extract search results.
    
* Sends direct HTTP requests to public web pages and extracts readable text from them, as long as the page is openly accessible and not behind authentication.
    

This is important to say clearly: this is not a web-scraping or crawling tool. It does not bypass protections or execute JavaScript. It is meant for simple, repeatable searches and lightweight text extraction for agents and backend systems.

I chose Go for the core mainly because of networking. Go’s standard library gives solid HTTP, TLS, timeouts, cancellation, and connection reuse out of the box. The workload here is network I/O, not heavy computation, and Go handles that very reliably.

Once the core was working, I needed to expose it as a JavaScript library. I already knew this pattern from tools like esbuild and Prisma, where the core is written in a different language and wrapped by a JS layer. I wrote a JS wrapper that spawns the Go binary. Platform-specific binaries (darwin-arm64, darwin-x64, linux, windows) are listed as dependencies, so the correct one gets installed based on the user’s platform. At this point the library was around version 0.0.4, and everything worked fine locally. I posted about it on LinkedIn.

The real problem showed up later. I bundled my backend (built using Bun and Hono) into a single binary. In that setup, the JS wrapper could no longer reliably find the Go binary. The issue was not Go itself, but assumptions about filesystem layout once everything is bundled.

My first thought was to port the Go core to JavaScript, but that would mean losing Go’s networking advantages. Then I looked at how native bcrypt works. Its core is written in C/C++ and exposed as a `.node` extension, which is a completely different architecture. I also considered rewriting the core in C or Rust and shipping it as a native addon, but that felt like serious over-engineering for a library where performance is dominated by network latency.

So I went back and researched how Prisma handles binaries. That led to the actual fix.

Now the library still ships with platform binaries, but if the binary is not found at runtime, it automatically downloads it from the GitHub releases page and caches it locally. There is also an option for users to manage the binary themselves if they want full control. This removed fragile assumptions and made the setup much more reliable.

The current version at the time of writing is 0.1.0.

I initially thought this would be a very small project. Feature-wise, it is. But it pushed me into areas I had not dealt with before: how JS runtime libraries really work, how native binaries are distributed, and how easy it is to make the wrong architectural choice early.

I named the library quack-search because it uses DuckDuckGo, and ducks make a quack sound.

GitHub: [https://github.com/adistrim/quack](https://github.com/adistrim/quack)  
npm: [https://www.npmjs.com/package/quack-search](https://www.npmjs.com/package/quack-search)

*Article Banner Image is AI-generated using Gemini.*

That’s it. Thanks for reading.
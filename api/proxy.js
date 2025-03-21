export default async function handler(req, res) {
    let { url } = req.query;

    // Check if URL parameter is provided
    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
        // Decode the URL parameter twice to handle encoded query parameters correctly
        url = decodeURIComponent(decodeURIComponent(url));

        // Ensure the URL is a valid HTTP or HTTPS URL
        const validUrl = new URL(url);
        if (!validUrl.protocol.startsWith('http')) {
            throw new Error('Invalid URL. Only HTTP and HTTPS URLs are allowed.');
        }

        // Fetch the target URL's content
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", // Mimic browser request
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            },
        });

        let data = await response.text();

        // Modify the <title> tag to change the browser tab title
        const customTitle = "Dashboard"; // Change this to your preferred tab title
        data = data.replace(/<title>(.*?)<\/title>/, `<title>${customTitle}</title>`);

        // Set the response headers and send the modified HTML back
        res.setHeader("Content-Type", "text/html");
        res.status(200).send(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching URL", details: error.message });
    }
}

export default async function handler(req, res) {
    let { url } = req.query;

    // Check if the URL parameter is missing
    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
        // Decode the URL only once
        url = decodeURIComponent(url);

        // Validate if the URL starts with 'http' or 'https'
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
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
        const customTitle = "My Custom Tab Title"; // Change this to your preferred tab title
        data = data.replace(/<title>(.*?)<\/title>/, `<title>${customTitle}</title>`);

        // Set the response headers and send the modified HTML back
        res.setHeader("Content-Type", "text/html");
        res.status(200).send(data);
    } catch (error) {
        // Log the error to help with debugging
        console.error("Error processing the URL:", error.message);
        res.status(500).json({ error: "Error fetching URL", details: error.message });
    }
}


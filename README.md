# IP Cow CheckIP

A lightweight utility hosted on Cloudflare Pages that returns the user's public IP address as plain text. Perfect for CLI usage with `curl` or quick browser checks.

## Usage 

### CLI 
-   Get your default protocol IP (usually IPv4): 
    ```bash
    curl https://checkip.ipcow.com/
    ```
    Example output: `192.168.1.100` 

- Force IPv4: 
    ```bash
    curl -4 https://checkip.ipcow.com/
    ```
    Example output: `192.168.1.100`

- Force IPv6: 
    ```bash
    curl -6 https://checkip.ipcow.com/
    ```
    Example output: `2606:4700:4700::1111` 

### Browser 
- Visit [https://checkip.ipcow.com/](https://checkip.ipcow.com/) 
- Displays your connecting IP (IPv4 or IPv6, depending on your browser’s protocol preference) as plain text. 

### How It Works 
- Built with Cloudflare Pages and a single Function (`functions/\[\[path]].js`).
- Uses the `CF-Connecting-IP` header to detect the client’s public IP.
- Returns plain text for simplicity and expanded use cases. 

### Setup 
1. Clone the Repository: 
    ```bash
    git clone https://github.com/MichalAFerber/IPCow-checkip.git
    cd IPCow-checkip
    ```     
2. Deploy to Cloudflare Pages:
- Link the repository to Cloudflare Pages.
- Set the build output directory to / (no build command needed).
- Deploy! 

3. Custom Domain (optional):
- Add a CNAME record pointing to your Pages project (e.g., your-project.pages.dev).
- Configure in Cloudflare Pages settings.

### Notes  
This service returns only the IP used for the connection (IPv4 or IPv6), not both simultaneously. For a dual-IP display, check out <https://ipcow.com/>.
No external dependencies—just pure Cloudflare magic. Use at your will, no guarantees implied.

### License  
MIT License - feel free to use, modify, and share!
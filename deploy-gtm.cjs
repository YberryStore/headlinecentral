const ftp = require("basic-ftp");
const path = require("path");

async function deployToFtp() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  client.ftp.timeout = 120000; // 2 minutes timeout

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`=== CONNECTING TO HEADLINECENTRAL.CO.ZA (Attempt ${attempt}/${maxRetries}) ===`);
      await client.access({
        host: "headlinecentral.co.za",
        user: "admin@headlinecentral.co.za",
        password: process.argv[2],
        secure: false
      });

      console.log("Connected! Remote directory:", await client.pwd());
      const localBuildDir = path.resolve(__dirname, ".output", "public");

      console.log("Uploading files from:", localBuildDir);
      await client.uploadFromDir(localBuildDir);

      console.log("=== DEPLOYMENT COMPLETED SUCCESSFULLY! ===");
      return;
    } catch (err) {
      console.warn(`Attempt ${attempt} encountered error:`, err.message);
      client.close();
      if (attempt === maxRetries) {
        console.error("All deployment attempts failed.");
        process.exit(1);
      }
      console.log("Retrying in 5 seconds...");
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

deployToFtp();

const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();

app.use(cors());
app.use("/static", express.static("./static"));
const port = process.env.PORT || 5000;

app.get("/", (res) => {
  res.sendFile("./index.html");
});

app.get("/get", async (req, res) => {
  const url = req.query.url;
  console.log(url);
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;
  const thumbnail = info.videoDetails.thumbnails[0].url;
  let formats = info.formats;

  const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  // const format = ytdl.chooseFormat(info.formats, { quality: "136" });
  formats = formats.filter((format) => format.hasAudio === true);

  res.send({ title, thumbnail, audioFormats, formats });
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;

  res.header("Content-Disposition", `attachment;  filename="${title}.${type}"`);
  ytdl(url, { itag }).pipe(res);
});

app.listen(port, () => {
  console.log("hey !!!");
});

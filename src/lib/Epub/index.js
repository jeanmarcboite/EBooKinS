import JSZip from "jszip";
import { parseString } from "xml2js";

export function parseEpub(epubContent) {
  let jszip = new JSZip();
  console.log("parseEpub");
  jszip.loadAsync(epubContent).then(function (zip) {
    console.log(zip.files);
    zip
      .file("content.opf")
      .async("string")
      .then((text) => {
        parseString(text, function (err, result) {
          console.log("content.opf", result);
          console.log(result.package.metadata[0]);
          let cover = result.package.manifest[0].item[0].$;

          zip
            .file(cover.href)
            .async("array")
            .then((array) => console.log(array));
        });
      });
  });
}

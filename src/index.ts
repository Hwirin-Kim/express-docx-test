import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import createReport from "docx-templates";
import zipdir from "zip-dir";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const port = 3000;

app.post("/generate-docx", async (req, res) => {
  const { name, address, age } = req.body;
  // 현재 작업 디렉토리와 파일 위치를 출력해서 확인
  console.log("Current working directory:", process.cwd());
  // 절대 경로를 사용하여 파일 경로 설정
  const templatePath = path.resolve(__dirname, "./assets/test.docx");
  console.log("Template path:", templatePath);

  try {
    const template = fs.readFileSync(templatePath);
    const buffer = await createReport({
      cmdDelimiter: ["{", "}"],
      template,
      data: { name, address, age },
    });
    fs.writeFileSync("output.docx", buffer);
    res.send("File has been created");
  } catch (error) {
    res.status(500).send("Error reading template: " + error);
  }
});

app.post("/generate-zip", async (req, res) => {
  const { name, address, age } = req.body;

  // 1단계: 요청이 있을 때마다 현재 날짜&시간의 이름으로 된 폴더 생성
  const currentDateTime = new Date().toISOString().replace(/[-:.]/g, "");
  const folderPath = path.join(__dirname, "assets", currentDateTime);
  fs.mkdirSync(folderPath, { recursive: true });

  console.log("Current working directory:", process.cwd());
  const templatePath = path.resolve(__dirname, "./assets/test.docx");
  console.log("Template path:", templatePath);

  try {
    const template = fs.readFileSync(templatePath);
    const buffer = await createReport({
      cmdDelimiter: ["{", "}"],
      template,
      data: { name, address, age },
    });

    console.log("1단계 : 폴더 생성 완료");
    // 2단계: 1단계에서 만들어진 폴더에 파일 생성
    const outputFilePath = path.join(folderPath, "output.docx");
    fs.writeFileSync(outputFilePath, buffer);
    console.log("2단계 : 폴더에 파일 생성 완료");

    // 3단계: 1단계에서 만들어진 폴더를 압축하여 zip파일 생성
    const zipFilePath = path.join(__dirname, `${currentDateTime}.zip`);
    await zipdir(folderPath, { saveTo: zipFilePath });
    console.log("3단계 : 폴더 압축파일 생성 완료");

    res.send("zip File has been created");
  } catch (error) {
    res.status(500).send("Error processing request: " + error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import createReport from "docx-templates";

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

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

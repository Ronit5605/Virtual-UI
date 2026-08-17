import User from "../models/user.model.js"
import { askAI } from "../utils/openRouter.js"
// for npm publish
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import Component from "../models/components.model.js";



export const generateComponent = async (req,res)=>{
 try{

  const { prompt } = req.body

  const user = await User.findById(req.userId)

  if(!user){
   return res.status(404).json({
    message:"User not found"
   })
  }

  if(user.role === "user"){

   if(user.aiCredits < 50){
    return res.status(400).json({
     message:"Not enough AI credits"
    })
   }

   user.aiCredits -= 50
   await user.save()
  }

  const messages = [
  {
    role: "system",
    content: `You are a React component generator. Output ONLY a valid JSON object. No markdown, no backticks, no explanation.

CRITICAL: Your entire response must be parseable by JSON.parse(). Start with { and end with }.

OUTPUT FORMAT:
{
  "name": "ComponentName",
  "code": "<full component code as single escaped string>",
  "props": ["prop1", "prop2"]
}

--- CODE RULES ---
- Import hooks like this: import React, { useState, useEffect, useRef, useCallback } from "react";
- Named export only: export const ComponentName = ({ ...props }) => { ... }
- Inline styles ONLY. No CSS classes, no Tailwind, no styled-components.
- All props must have default values. Component must look great with zero props passed.
- No TypeScript. No external libraries. No framer-motion. No icon libraries.
- NEVER use template literals inside JSX style objects.
  BAD:  style={{ border: "1px solid " + accent }} using backtick version
  GOOD: style={{ border: "1px solid " + accent }}
- Always use string concatenation for dynamic style values: "1px solid " + accent
- NEVER use position "fixed". Use "absolute" or "relative" only.
- For hex to rgba conversion, define this helper inside the component:
  const alpha = (hex, op) => { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return "rgba("+r+","+g+","+b+","+op+")"; };
- In the JSON output, escape every double quote inside the code string as \\"
- In the JSON output, escape every newline inside the code string as \\n
- Do NOT use single quotes inside JSX. Use escaped double quotes \\" only.

--- DESIGN RULES ---
- Dark backgrounds: #0f172a, #020617, #0d1117, #1e293b
- Rich accent colors: #6366f1, #7c3aed, #059669, #e11d48, #0ea5e9
- border-radius: 12px to 20px on cards, 8px to 10px on buttons
- Font: system-ui, -apple-system, sans-serif
- Subtle borders: 1px solid rgba(255,255,255,0.08)
- Box shadows: 0 10px 40px rgba(0,0,0,0.4)
- Must look like a premium UI screenshot with zero props passed.

--- LIVE PREVIEW RULES ---
- Renders inside react-live sandbox. Container is dark #020617, 800px wide, 400px min-height.
- NEVER use position fixed. It breaks the sandbox.
- NEVER import from any external package. Only React and its hooks are in scope.
- Everything must be self-contained inside the component.
- Use widths between 280px and 720px so it centers nicely in preview.

--- EXAMPLE 1: Button ---
{"name":"Button","code":"import React from \\"react\\";\\n\\nexport const Button = ({ text = \\"Get Started\\", bg = \\"#7c3aed\\", color = \\"#fff\\", size = \\"md\\", disabled = false, loading = false, onClick = () => {} }) => {\\n  const sizes = { sm: \\"8px 16px\\", md: \\"11px 24px\\", lg: \\"14px 32px\\" };\\n  return (\\n    <button\\n      onClick={onClick}\\n      disabled={disabled || loading}\\n      style={{\\n        background: bg,\\n        color: color,\\n        padding: sizes[size],\\n        borderRadius: \\"10px\\",\\n        border: \\"none\\",\\n        cursor: disabled ? \\"not-allowed\\" : \\"pointer\\",\\n        fontWeight: \\"700\\",\\n        fontSize: \\"15px\\",\\n        fontFamily: \\"system-ui,sans-serif\\",\\n        boxShadow: \\"0 4px 14px rgba(124,58,237,0.4)\\",\\n        opacity: disabled ? 0.6 : 1,\\n        transition: \\"opacity 0.2s\\"\\n      }}\\n    >\\n      {loading ? \\"Loading...\\" : text}\\n    </button>\\n  );\\n};","props":["text","bg","color","size","disabled","loading","onClick"]}

--- EXAMPLE 2: ImageCard ---
{"name":"ImageCard","code":"import React, { useState } from \\"react\\";\\n\\nexport const ImageCard = ({\\n  image = \\"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80\\",\\n  tag = \\"Travel\\",\\n  title = \\"Discover the Hidden Peaks\\",\\n  description = \\"A breathtaking journey through untouched landscapes and snow-capped summits.\\",\\n  buttonText = \\"Read More\\",\\n  accent = \\"#6366f1\\",\\n  bg = \\"#0f172a\\",\\n  onButtonClick = () => {}\\n}) => {\\n  const [hovered, setHovered] = useState(false);\\n  const alpha = (hex, op) => {\\n    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);\\n    return \\"rgba(\\" + r + \\",\\" + g + \\",\\" + b + \\",\\" + op + \\")\\";\\n  };\\n  return (\\n    <div\\n      onMouseEnter={() => setHovered(true)}\\n      onMouseLeave={() => setHovered(false)}\\n      style={{\\n        background: bg,\\n        borderRadius: \\"20px\\",\\n        overflow: \\"hidden\\",\\n        width: \\"300px\\",\\n        border: \\"1px solid \\" + (hovered ? alpha(accent, 0.3) : \\"rgba(255,255,255,0.07)\\"),\\n        fontFamily: \\"system-ui,sans-serif\\",\\n        transition: \\"transform 0.25s, box-shadow 0.25s\\",\\n        transform: hovered ? \\"translateY(-4px)\\" : \\"translateY(0px)\\",\\n        boxShadow: hovered ? \\"0 16px 40px rgba(0,0,0,0.5)\\" : \\"0 4px 20px rgba(0,0,0,0.3)\\"\\n      }}\\n    >\\n      <div style={{ position: \\"relative\\", width: \\"100%\\", height: \\"180px\\", overflow: \\"hidden\\" }}>\\n        <img src={image} alt={title} style={{ width: \\"100%\\", height: \\"100%\\", objectFit: \\"cover\\", transform: hovered ? \\"scale(1.05)\\" : \\"scale(1)\\", transition: \\"transform 0.4s ease\\" }} />\\n        <div style={{ position: \\"absolute\\", inset: 0, background: \\"linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)\\" }} />\\n        {tag && (\\n          <div style={{ position: \\"absolute\\", top: \\"12px\\", left: \\"12px\\", padding: \\"4px 10px\\", borderRadius: \\"20px\\", background: alpha(accent, 0.85), fontSize: \\"10px\\", fontWeight: \\"700\\", color: \\"#fff\\", textTransform: \\"uppercase\\", letterSpacing: \\"0.5px\\" }}>{tag}</div>\\n        )}\\n      </div>\\n      <div style={{ padding: \\"18px\\" }}>\\n        <h3 style={{ fontSize: \\"15px\\", fontWeight: \\"700\\", color: \\"#fff\\", margin: \\"0 0 8px\\", lineHeight: 1.4 }}>{title}</h3>\\n        <p style={{ fontSize: \\"13px\\", color: \\"rgba(255,255,255,0.45)\\", lineHeight: 1.65, margin: \\"0 0 18px\\" }}>{description}</p>\\n        <button\\n          onClick={onButtonClick}\\n          style={{ width: \\"100%\\", padding: \\"11px\\", borderRadius: \\"12px\\", border: \\"none\\", background: \\"linear-gradient(135deg, \\" + accent + \\", \\" + alpha(accent, 0.7) + \\")\\" , color: \\"#fff\\", fontSize: \\"13px\\", fontWeight: \\"700\\", cursor: \\"pointer\\", fontFamily: \\"inherit\\" }}\\n        >{buttonText}</button>\\n      </div>\\n    </div>\\n  );\\n};","props":["image","tag","title","description","buttonText","accent","bg","onButtonClick"]}

--- EXAMPLE 3: PricingCard ---
{"name":"PricingCard","code":"import React from \\"react\\";\\n\\nexport const PricingCard = ({\\n  planName = \\"Pro Plan\\",\\n  description = \\"For teams that need more power.\\",\\n  price = 29,\\n  currency = \\"$\\",\\n  period = \\"per month\\",\\n  badgeText = \\"Most Popular\\",\\n  ctaText = \\"Get Started\\",\\n  accent = \\"#6366f1\\",\\n  bg = \\"#0f172a\\",\\n  features = [\\"Unlimited projects\\", \\"Priority support\\", \\"Advanced analytics\\", \\"Custom integrations\\"],\\n  onCtaClick = () => {}\\n}) => {\\n  const alpha = (hex, op) => {\\n    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);\\n    return \\"rgba(\\" + r + \\",\\" + g + \\",\\" + b + \\",\\" + op + \\")\\";\\n  };\\n  return (\\n    <div style={{ background: bg, borderRadius: \\"20px\\", padding: \\"28px 24px\\", width: \\"300px\\", color: \\"#fff\\", fontFamily: \\"system-ui,sans-serif\\", boxShadow: \\"0 10px 40px rgba(0,0,0,0.5)\\", border: \\"1px solid \\" + alpha(accent, 0.25), position: \\"relative\\", overflow: \\"hidden\\" }}>\\n      <div style={{ position: \\"absolute\\", top: 0, left: 0, right: 0, height: \\"3px\\", background: \\"linear-gradient(90deg, \\" + accent + \\", \\" + alpha(accent, 0.3) + \\")\\" }} />\\n      {badgeText && (\\n        <div style={{ display: \\"inline-flex\\", alignItems: \\"center\\", gap: \\"6px\\", padding: \\"4px 12px\\", borderRadius: \\"100px\\", marginBottom: \\"14px\\", background: alpha(accent, 0.12), border: \\"1px solid \\" + alpha(accent, 0.3), fontSize: \\"11px\\", fontWeight: \\"700\\", color: accent, textTransform: \\"uppercase\\", letterSpacing: \\"0.5px\\" }}>\\n          <div style={{ width: 6, height: 6, borderRadius: \\"50%\\", background: accent }} />\\n          {badgeText}\\n        </div>\\n      )}\\n      <div style={{ fontSize: \\"20px\\", fontWeight: \\"800\\", marginBottom: \\"4px\\" }}>{planName}</div>\\n      <div style={{ fontSize: \\"13px\\", color: \\"rgba(255,255,255,0.45)\\", marginBottom: \\"20px\\" }}>{description}</div>\\n      <div style={{ display: \\"flex\\", alignItems: \\"flex-end\\", gap: \\"3px\\", marginBottom: \\"4px\\" }}>\\n        <span style={{ fontSize: \\"18px\\", fontWeight: \\"700\\", color: \\"rgba(255,255,255,0.5)\\", lineHeight: 2 }}>{currency}</span>\\n        <span style={{ fontSize: \\"52px\\", fontWeight: \\"800\\", lineHeight: 1 }}>{Math.round(price)}</span>\\n      </div>\\n      <div style={{ fontSize: \\"12px\\", color: \\"rgba(255,255,255,0.35)\\", marginBottom: \\"20px\\" }}>{period}</div>\\n      <div style={{ height: \\"1px\\", background: \\"rgba(255,255,255,0.07)\\", marginBottom: \\"16px\\" }} />\\n      <ul style={{ listStyle: \\"none\\", padding: 0, margin: \\"0 0 22px\\", display: \\"flex\\", flexDirection: \\"column\\", gap: \\"10px\\" }}>\\n        {features.map((f, i) => (\\n          <li key={i} style={{ display: \\"flex\\", alignItems: \\"center\\", gap: \\"10px\\", fontSize: \\"13px\\", color: \\"rgba(255,255,255,0.75)\\" }}>\\n            <div style={{ width: \\"18px\\", height: \\"18px\\", borderRadius: \\"50%\\", display: \\"flex\\", alignItems: \\"center\\", justifyContent: \\"center\\", background: alpha(accent, 0.18), border: \\"1px solid \\" + alpha(accent, 0.4), flexShrink: 0 }}>\\n              <svg width=\\"10\\" height=\\"10\\" viewBox=\\"0 0 12 12\\" fill=\\"none\\" stroke=\\"#fff\\" strokeWidth=\\"2\\" strokeLinecap=\\"round\\" strokeLinejoin=\\"round\\"><polyline points=\\"1.5,6 4.5,9 10.5,3\\" /></svg>\\n            </div>\\n            {f}\\n          </li>\\n        ))}\\n      </ul>\\n      <button onClick={onCtaClick} style={{ width: \\"100%\\", padding: \\"13px\\", borderRadius: \\"12px\\", border: \\"none\\", background: \\"linear-gradient(135deg, \\" + accent + \\", \\" + alpha(accent, 0.7) + \\")\\" , color: \\"#fff\\", fontSize: \\"14px\\", fontWeight: \\"700\\", cursor: \\"pointer\\", fontFamily: \\"system-ui,sans-serif\\" }}>{ctaText}</button>\\n    </div>\\n  );\\n};","props":["planName","description","price","currency","period","badgeText","ctaText","accent","bg","features","onCtaClick"]}

--- EXAMPLE 4: Navbar ---
{"name":"Navbar","code":"import React, { useState, useEffect } from \\"react\\";\\n\\nexport const Navbar = ({\\n  logo = \\"VirtualAI\\",\\n  links = [\\"Home\\", \\"Features\\", \\"Pricing\\", \\"Blog\\"],\\n  ctaText = \\"Get Started\\",\\n  accent = \\"#6366f1\\",\\n  bg = \\"#0f172a\\",\\n  onCtaClick = () => {},\\n  onLinkClick = () => {}\\n}) => {\\n  const [active, setActive] = useState(\\"Home\\");\\n  const [isMobile, setIsMobile] = useState(false);\\n  const alpha = (hex, op) => {\\n    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);\\n    return \\"rgba(\\" + r + \\",\\" + g + \\",\\" + b + \\",\\" + op + \\")\\";\\n  };\\n  useEffect(() => {\\n    const check = () => setIsMobile(window.innerWidth < 768);\\n    check();\\n    window.addEventListener(\\"resize\\", check);\\n    return () => window.removeEventListener(\\"resize\\", check);\\n  }, []);\\n  return (\\n    <nav style={{ background: bg, borderBottom: \\"1px solid rgba(255,255,255,0.06)\\", fontFamily: \\"system-ui,sans-serif\\", width: \\"100%\\", boxSizing: \\"border-box\\", borderRadius: \\"12px\\" }}>\\n      <div style={{ maxWidth: \\"1100px\\", margin: \\"0 auto\\", padding: \\"0 20px\\", height: \\"60px\\", display: \\"flex\\", alignItems: \\"center\\", justifyContent: \\"space-between\\" }}>\\n        <div style={{ display: \\"flex\\", alignItems: \\"center\\", gap: \\"8px\\", cursor: \\"pointer\\" }}>\\n          <div style={{ width: \\"28px\\", height: \\"28px\\", borderRadius: \\"8px\\", background: \\"linear-gradient(135deg, \\" + accent + \\", \\" + alpha(accent, 0.6) + \\")\\" , display: \\"flex\\", alignItems: \\"center\\", justifyContent: \\"center\\", fontSize: \\"13px\\", fontWeight: \\"800\\", color: \\"#fff\\" }}>{logo[0]}</div>\\n          <span style={{ fontSize: \\"15px\\", fontWeight: \\"800\\", color: \\"#fff\\" }}>{logo}</span>\\n        </div>\\n        {!isMobile && (\\n          <div style={{ display: \\"flex\\", gap: \\"2px\\" }}>\\n            {links.map(link => (\\n              <button key={link} onClick={() => { setActive(link); onLinkClick(link); }} style={{ background: active === link ? alpha(accent, 0.12) : \\"transparent\\", border: \\"none\\", padding: \\"7px 16px\\", borderRadius: \\"9px\\", fontSize: \\"14px\\", fontWeight: active === link ? \\"700\\" : \\"500\\", color: active === link ? accent : \\"rgba(255,255,255,0.5)\\", cursor: \\"pointer\\", fontFamily: \\"inherit\\" }}>{link}</button>\\n            ))}\\n          </div>\\n        )}\\n        <button onClick={onCtaClick} style={{ padding: \\"8px 18px\\", borderRadius: \\"10px\\", border: \\"none\\", background: \\"linear-gradient(135deg, \\" + accent + \\", \\" + alpha(accent, 0.75) + \\")\\" , color: \\"#fff\\", fontSize: \\"13px\\", fontWeight: \\"700\\", cursor: \\"pointer\\", fontFamily: \\"inherit\\" }}>{ctaText}</button>\\n      </div>\\n    </nav>\\n  );\\n};","props":["logo","links","ctaText","accent","bg","onCtaClick","onLinkClick"]}`,
  },
  {
    role: "user",
    content: prompt,
  }
  
];

  const aiResponse = await askAI(messages)

  let parsed;

  try {

    const clean = aiResponse
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim()

    parsed = JSON.parse(clean)

  } catch (error) {

    console.log("AI RESPONSE:", aiResponse)

    return res.status(500).json({
      message:"AI returned invalid JSON"
    })

  }

  res.json({parsed, remainingCredits:
        user.role === "user" ? user.aiCredits : null,})

 }catch(err){
  console.log(err)
  res.status(500).json({message:err.message})
 }
}

export const saveComponent = async (req, res) => {
  try {
    const { name, code, props } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Admin — public components mein duplicate check
    if (user.role === "admin") {
      const existing = await Component.findOne({ name, visibility: "public" });

      if (existing) {
        return res.status(400).json({
          message: "Admin cannot create duplicate public component name",
        });
      }
    }

    //Normal user — apne khud ke components mein duplicate check
    if (user.role !== "admin") {
      const existing = await Component.findOne({
        name,
        owner: req.userId,
      });

      if (existing) {
        return res.status(400).json({
          message: "You already have a component with this name",
        });
      }
    }

    const component = await Component.create({
      name,
      code,
      props,
      owner: req.userId,
    });

    res.json(component);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const publishComponent = async (req, res) => {
  let publishStep = "preparing the component";

  // Required imports:
  // fs, path, execSync are already imported at the top of your file.

  let tempLibPath = null;

  try {
    // -----------------------------------------
    // 1. CHECK ADMIN
    // -----------------------------------------
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can publish",
      });
    }

    // -----------------------------------------
    // 2. GET COMPONENT
    // -----------------------------------------
    const { componentId } = req.body;

    const component = await Component.findById(componentId);

    if (!component) {
      return res.status(404).json({
        message: "Component not found",
      });
    }

    if (
      !component.owner ||
      component.owner.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({
        message: "You can only publish your own components",
      });
    }

    // -----------------------------------------
    // 3. CHECK NPM TOKEN
    // -----------------------------------------
    if (!process.env.NPM_TOKEN) {
      throw new Error("NPM_TOKEN is not configured on the server");
    }

    // -----------------------------------------
    // 4. ORIGINAL LIBRARY PATH
    // -----------------------------------------
    const libPath = path.resolve(
      process.cwd(),
      "../virtual-ui-lib"
    );

    // -----------------------------------------
    // 5. CREATE UNIQUE TEMP DIRECTORY
    // -----------------------------------------
    const tempRoot = path.join(
      process.cwd(),
      "tmp"
    );

    if (!fs.existsSync(tempRoot)) {
      fs.mkdirSync(tempRoot, { recursive: true });
    }

    tempLibPath = fs.mkdtempSync(
      path.join(tempRoot, "virtual-ui-lib-")
    );

    console.log("Temporary library:", tempLibPath);

    // -----------------------------------------
    // 6. COPY LIBRARY SOURCE
    // -----------------------------------------
    fs.cpSync(
      libPath,
      tempLibPath,
      {
        recursive: true,
        filter: (src) => {
          const normalized = src.replace(/\\/g, "/");

          // Don't copy node_modules or dist
          if (
            normalized.includes("/node_modules") ||
            normalized.includes("/dist")
          ) {
            return false;
          }

          return true;
        },
      }
    );

    // -----------------------------------------
    // 7. COMPONENT PATHS
    // -----------------------------------------
    const componentDir = path.join(
      tempLibPath,
      "src",
      "components",
      component.name
    );

    const componentFile = path.join(
      componentDir,
      `${component.name}.jsx`
    );

    const indexFile = path.join(
      tempLibPath,
      "src",
      "index.js"
    );

    // -----------------------------------------
    // 8. CREATE COMPONENT DIRECTORY
    // -----------------------------------------
    fs.mkdirSync(componentDir, {
      recursive: true,
    });

    // -----------------------------------------
    // 9. WRITE COMPONENT
    // -----------------------------------------
    fs.writeFileSync(
      componentFile,
      component.code,
      "utf8"
    );

    // -----------------------------------------
    // 10. UPDATE INDEX.JS
    // -----------------------------------------
    let indexContent = fs.readFileSync(
      indexFile,
      "utf8"
    );

    const code = fs.readFileSync(
      componentFile,
      "utf8"
    );

    let exportLine;

    const namedExport = code.match(
      /export\s+(?:const|function|class)\s+([A-Za-z0-9_$]+)/
    );

    const defaultExport = code.match(
      /export\s+default\s+([A-Za-z0-9_$]+)/
    );

    if (namedExport) {
      exportLine =
        `export { ${namedExport[1]} as ${component.name} } from "./components/${component.name}/${component.name}.jsx";`;
    } else if (defaultExport) {
      exportLine =
        `export { default as ${component.name} } from "./components/${component.name}/${component.name}.jsx";`;
    } else {
      throw new Error(
        `Could not detect export from ${component.name}.jsx`
      );
    }

    // Prevent duplicate export
    if (!indexContent.includes(exportLine)) {
      indexContent += `\n${exportLine}\n`;

      fs.writeFileSync(
        indexFile,
        indexContent,
        "utf8"
      );
    }

    // -----------------------------------------
    // 11. GET LATEST NPM VERSION
    // -----------------------------------------
    console.log("Checking latest npm version...");

    publishStep = "checking npm package version";

    let latestVersion;

    try {
      latestVersion = execSync(
        "npm view @ronit5605/virtual-ui-library version --registry=https://registry.npmjs.org/",
        {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        }
      ).trim();
    } catch (error) {
      // If package doesn't exist yet
      latestVersion = "1.0.0";

      console.log(
        "Package not found on npm. Starting from:",
        latestVersion
      );
    }

    console.log(
      "Latest published version:",
      latestVersion
    );

    // -----------------------------------------
    // 12. CALCULATE NEXT VERSION
    // -----------------------------------------
    const versionParts = latestVersion
      .replace(/^v/, "")
      .split(".")
      .map(Number);

    if (
      versionParts.length !== 3 ||
      versionParts.some(Number.isNaN)
    ) {
      throw new Error(
        `Invalid npm version returned: ${latestVersion}`
      );
    }

    const [major, minor, patch] = versionParts;

    const nextVersion =
      `${major}.${minor}.${patch + 1}`;

    console.log(
      "Next version:",
      nextVersion
    );

    // -----------------------------------------
    // 13. UPDATE TEMP PACKAGE.JSON
    // -----------------------------------------
    const packageJsonPath = path.join(
      tempLibPath,
      "package.json"
    );

    const packageJson = JSON.parse(
      fs.readFileSync(
        packageJsonPath,
        "utf8"
      )
    );

    packageJson.version = nextVersion;

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n",
      "utf8"
    );

    // -----------------------------------------
    // 14. INSTALL DEPENDENCIES
    // -----------------------------------------
    console.log(
      "Installing library dependencies..."
    );

    publishStep =
      "installing library dependencies";

    execSync(
      "npm install --no-audit --no-fund",
      {
        cwd: tempLibPath,
        stdio: "inherit",
      }
    );

    // -----------------------------------------
    // 15. BUILD LIBRARY
    // -----------------------------------------
    console.log(
      "Building library..."
    );

    publishStep =
      "building the library";

    execSync(
      "npm run build",
      {
        cwd: tempLibPath,
        stdio: "inherit",
      }
    );

    console.log(
      "Library build successful."
    );

    // -----------------------------------------
    // 16. CREATE TEMP .NPMRC
    // -----------------------------------------
    const npmrcPath = path.join(
      tempLibPath,
      ".npmrc"
    );

    fs.writeFileSync(
      npmrcPath,
      [
        "registry=https://registry.npmjs.org/",
        `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`,
      ].join("\n") + "\n",
      "utf8"
    );

    // -----------------------------------------
    // 17. PUBLISH TO NPM
    // -----------------------------------------
    console.log(
      `Publishing version ${nextVersion} to npm...`
    );

    publishStep =
      "publishing the package to npm";

    try {
      const publishOutput = execSync(
        "npm publish --access public --registry=https://registry.npmjs.org/",
        {
          cwd: tempLibPath,
          encoding: "utf8",
          stdio: "pipe",
        }
      );

      console.log(
        "npm publish output:"
      );

      console.log(
        publishOutput
      );

    } finally {
      // Remove npm credentials immediately
      if (fs.existsSync(npmrcPath)) {
        fs.unlinkSync(npmrcPath);
      }
    }

    // -----------------------------------------
    // 18. UPDATE DATABASE
    // -----------------------------------------
    component.visibility = "public";

    component.npmPackage =
      "@ronit5605/virtual-ui-library";

    await component.save();

    // -----------------------------------------
    // 19. SUCCESS
    // -----------------------------------------
    res.json({
      message:
        "Component published successfully",
      version: nextVersion,
      package:
        "@ronit5605/virtual-ui-library",
    });

  } catch (error) {

    const commandOutput = [
      error.stdout,
      error.stderr,
    ]
      .filter(Boolean)
      .map((output) =>
        output.toString().trim()
      )
      .join("\n");

    const npmErrorCode =
      commandOutput.match(
        /npm (?:ERR!|error) code ([A-Z0-9_]+)/i
      )?.[1];

    const detail = npmErrorCode
      ? ` (${npmErrorCode})`
      : "";

    console.error(
      `Publish Error while ${publishStep}:`,
      error.message
    );

    if (commandOutput) {
      console.error(commandOutput);
    }

    res.status(500).json({
      message:
        `${publishStep} failed${detail}. Check the server log for details.`,
      error: error.message,
    });

  } finally {

    // -----------------------------------------
    // 20. DELETE TEMP DIRECTORY
    // -----------------------------------------
    if (
      tempLibPath &&
      fs.existsSync(tempLibPath)
    ) {
      try {
        fs.rmSync(
          tempLibPath,
          {
            recursive: true,
            force: true,
          }
        );

        console.log(
          "Temporary library deleted."
        );

      } catch (cleanupError) {
        console.error(
          "Failed to clean temporary directory:",
          cleanupError.message
        );
      }
    }
  }
};


export const getAllComponents = async (req, res) => {
  try {
    const components = await Component.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(components);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


import { GoogleGenAI } from "@google/genai";

export async function generateAiMockup(
  templateUrl: string,
  logoBase64: string | null,
  designName: string,
  colors: string[],
  gender: 'mens' | 'womens'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Helper to fetch template image as base64 if it's a URL
  const getBase64FromUrl = async (url: string): Promise<{ data: string, mimeType: string }> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({ data: base64, mimeType: blob.type });
      };
      reader.readAsDataURL(blob);
    });
  };

  const templatePart = await getBase64FromUrl(templateUrl);
  
  const subjectDescription = gender === 'mens' 
    ? `A young male student of Indigenous Australian and Māori heritage. He has striking light blue eyes and an athletic, lean muscular build. His hair is a messy textured taper-fade (no mullet).`
    : `A naturally beautiful 18-year-old school student with a sun-kissed look. She has beachy blonde hair styled in loose, natural waves. She has striking blue eyes and light, natural freckles across her nose and cheeks. She has a graceful, athletic posture.`;

  const parts: any[] = [
    {
      inlineData: templatePart
    },
    {
      text: `Task: Create a professional e-commerce product mockup of a ${gender === 'mens' ? 'young man' : 'young woman'} wearing a custom rugby jersey.
      
      SUBJECT DESCRIPTION:
      ${subjectDescription}
      
      TECHNICAL SPECS:
      - Hyper-realistic portrait, 8k resolution.
      - Shot on 85mm lens, medium-full shot framing.
      - VISIBILITY: The entire jersey MUST be fully visible from collar to bottom hem. 
      - BOTTOM DETAIL: Include a small portion of the top of their tailored school trousers/skirt at the very bottom of the frame to show the full fit.
      - Professional studio lighting, clean and minimalist.
      - Solid neutral light gray background.
      - Natural, confident expression.

      DESIGN INTEGRITY: 
      The rugby jersey MUST be an identical replica of the pattern, stripes, and layout shown in the attached reference jersey image. 
      Style Name: ${designName}.
      Colors: Apply the colours ${colors.join(' and ')} strictly to the stripes/panels defined by the template.
      
      MANDATORY BRANDING:
      The 'Classic' brand logo (as seen in the template) MUST be preserved in its original position on the model's LEFT chest (viewer's RIGHT). It should be clearly rendered and sharp.
      
      MANDATORY RULE: The collar MUST remain pure WHITE. No exceptions.
      
      The goal is a high-resolution, professional studio shot for a premium apparel brand.`
    }
  ];

  if (logoBase64) {
    const logoData = logoBase64.split(',')[1];
    const mimeType = logoBase64.split(';')[0].split(':')[1];
    parts.push({
      inlineData: { data: logoData, mimeType }
    });
    parts.push({
      text: `EMBROIDERY DETAIL: 
      Take the second attached image (school logo) and render it as a realistic embroidered badge.
      Placement: On the model's RIGHT CHEST (viewer's LEFT), exactly opposite the 'Classic' logo branding.
      The result should show both logos: 'Classic' on the model's left, and the school logo on the model's right.
      Ensure the stitching texture of the logo is visible and detailed.`
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ parts }],
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (imagePart?.inlineData) {
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  }

  throw new Error("Failed to generate AI mockup");
}

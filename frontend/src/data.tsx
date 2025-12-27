import { Code2, Compass, Rocket } from "lucide-react";
const ROLE_STYLES: Record<
  string,
  {
    colorVar: string;
    icon: React.ReactElement;
  }
> = {
  engineer: {
    colorVar: "--engineer",
    icon: <Code2 className="w-8 h-8" />,
  },  
  product_manager: {
    colorVar: "--product",
    icon: <Compass className="w-8 h-8" />,
  },
  founder: {
    colorVar: "--founder",
    icon: <Rocket className="w-8 h-8" />,
  },
};

export default ROLE_STYLES;
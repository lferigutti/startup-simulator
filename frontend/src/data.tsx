import { Code2, Rocket,Target } from "lucide-react";
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
    icon: <Target className="w-8 h-8" />,
  },
  founder: {
    colorVar: "--founder",
    icon: <Rocket className="w-8 h-8" />,
  },
};

export default ROLE_STYLES;

import {
  defineConfig,
  presetUno,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { colors } from "@unocss/preset-uno/dist/colors";

export default defineConfig({
  presets: [presetUno()],
  transformers: [
    transformerCompileClass(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: colors!.blue,
      secondary: colors!.slate,
      warning: colors!.amber,
      error: colors!.rose,
      success: colors!.green,
    },
  },
});

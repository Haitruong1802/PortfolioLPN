// JSX augmentation for the <blossom-carousel> custom element.
// Imports are allowed here because module augmentation requires module context.

import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "blossom-carousel": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          class?: string;
          "aria-roledescription"?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};

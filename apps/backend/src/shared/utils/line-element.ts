const absoluteFull =
  "position: absolute; top: 0; right: 0; bottom: 0; left: 0; ";

const sizeCenter =
  "width: 100%; max-width: 400px; min-width: 100px; margin:8px auto;";
export const lineElement = (styles: string) => {
  return `<div style="
    ${sizeCenter}
    height:2px;
    ${styles}
    background:currentColor;
box-shadow:
  0 0 5px currentColor,
  0 0 10px currentColor,
  0 0 20px currentColor,
  0 0 40px currentColor;
  "></div>`;
};

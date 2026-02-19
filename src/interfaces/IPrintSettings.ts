
export interface ILayoutSettings {
  format: string;
  orientation: 'portrait' | 'landscape';
  width?: number;  // Ancho final en mm
  height?: number; // Alto final en mm
}

export interface IMarginSettings {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IOptionSettings {
  scale: number;
  printBackground: boolean;
  pageNumbers: boolean;
}

export interface IPrintConfig {
  layout: ILayoutSettings;
  margins: IMarginSettings;
  options: IOptionSettings;
}
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Rect extends Position, Size {}

export class ImageCache {
  public cache: Map<string, HTMLImageElement>;

  get(src: string): HTMLImageElement | null {
    let img = this.cache.get(src);
    if (img) {
      return img.complete ? img : null;
    }
    img = document.createElement("img");
    img.src = src;
    this.cache.set(src, img);
    return null;
  }

  remove(src: string): void {
    this.cache.delete(src);
  }

  clear(): void {
    this.cache.clear();
  }
}

export class CanvasRenderer {
  public c: CanvasRenderingContext2D;
  public imgCache: ImageCache;

  constructor(arg: CanvasRenderingContext2D | HTMLCanvasElement | string) {
    this.imgCache = new ImageCache();

    if (arg instanceof CanvasRenderingContext2D) {
      this.c = arg;
    } else if (arg instanceof HTMLCanvasElement) {
      this.c = arg.getContext("2d");
    } else if (typeof arg === "string") {
      const canvas = document.getElementById(arg);
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("invalid element");
      }
      this.c = canvas.getContext("2d");
    } else {
      throw new Error("invalid argument");
    }

    this.c.imageSmoothingQuality = "high";
  }

  getCanvasSize(): Size {
    return {
      w: this.c.canvas.width,
      h: this.c.canvas.height,
    };
  }

  drawRect(rect: Rect, style: string): this {
    this.c.fillStyle = style;
    this.c.fillRect(rect.x, rect.y, rect.w, rect.h);
    return this;
  }

  strokeRect(rect: Rect, lineWidth: number, style: string): this {
    this.c.lineWidth = lineWidth;
    this.c.strokeStyle = style;
    this.c.strokeRect(rect.x, rect.y, rect.w, rect.h);
    return this;
  }

  getImage(src: string): HTMLImageElement | null {
    return this.imgCache.get(src);
  }

  removeImage(src: string): void {
    this.imgCache.remove(src);
  }

  drawImage(img: HTMLImageElement, src: Rect | null, dst: Rect): this {
    if (!src) {
      src = { x: 0, y: 0, w: img.width, h: img.height };
    }
    this.c.drawImage(img, src.x, src.y, src.w, src.h, dst.x, dst.y, dst.w, dst.h);
    return this;
  }
}

export function startRenderLoop(cb: (ts: number) => boolean) {
  let prev: number;

  const fn = () => {
    const now = performance.now();
    if (cb(now - prev)) {
      prev = now;
      requestAnimationFrame(fn);
    }
  };

  requestAnimationFrame(() => {
    prev = performance.now();
    requestAnimationFrame(fn);
  });
}

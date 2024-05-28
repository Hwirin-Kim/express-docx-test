declare module "zip-dir" {
  interface Options {
    saveTo?: string;
    each?(path: string, buffer: Buffer): void;
    filter?(path: string, stat: any): boolean;
  }

  function zipdir(path: string, options: Options): Promise<Buffer>;
  function zipdir(
    path: string,
    callback: (err: Error | null, buffer: Buffer) => void
  ): void;
  function zipdir(
    path: string,
    options: Options,
    callback: (err: Error | null, buffer: Buffer) => void
  ): void;

  export = zipdir;
}

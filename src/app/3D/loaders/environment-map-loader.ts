import type { WebGLRenderTarget } from 'three';
import { LinearEncoding, NearestFilter } from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import type { ProductConfigurator } from '../product-configurator';
import { getOnProgressCallback } from '../get-on-progress-callback';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator';

export class EnvironmentMapLoader {
  public environments: Map<string, Promise<WebGLRenderTarget>> = new Map<string, Promise<WebGLRenderTarget>>();

  private productConfigurator: ProductConfigurator;

  constructor(productChanger: ProductConfigurator) {
    this.productConfigurator = productChanger;
  }

  public loadEnvironment(file: string): Promise<WebGLRenderTarget> {
    if (this.environments.has(file)) {
      return this.environments.get(file)!;
    }

    const promise: Promise<WebGLRenderTarget> = new Promise((resolve) => {
      const renderer = this.productConfigurator.renderer;

      new EXRLoader().load(file, (texture) => {
        texture.minFilter = NearestFilter;
        texture.encoding = LinearEncoding;

        const pmremGenerator = new PMREMGenerator(renderer);
        const renderTarget = pmremGenerator.fromEquirectangular(texture);

        texture.dispose();
        pmremGenerator.dispose();

        // this.productConfigurator.scene.background = renderTarget.texture;
        resolve(renderTarget);
      }, getOnProgressCallback(this.productConfigurator.productConfiguratorService));
    });

    this.environments.set(file, promise);

    return promise;
  }
}

import * as nsfwjs from 'nsfwjs';
import { Service } from 'typedi';

@Service()
export class NSFWLoader {

  constructor(private nsfwModel: nsfwjs.NSFWJS) { }

  async getNsfwModel() {
    if (!this.nsfwModel.model) {
      this.nsfwModel = await nsfwjs.load('file://app/communityresources/nsfwjs/', { size: 299 });
    }
    return this.nsfwModel;
  }
}

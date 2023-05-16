import Region, { IRegion } from '@/models/Region';

export async function getRegionById(regionId: string): Promise<IRegion | null> {
  try {
    const region = await Region.findById(regionId, { _id: 1, name: 1 });
    if (!region) {
      throw new Error('Region not found');
    }

    return region;
  } catch (err) {
    return null;
  }
}

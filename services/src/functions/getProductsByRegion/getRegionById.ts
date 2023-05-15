import Region, { IRegion } from '@/models/Region';

export async function getRegionById(regionId: string): Promise<IRegion | null> {
  try {
    const region = await Region.findById(regionId);
    if (!region) {
      throw new Error('Region not found');
    }

    return region;
  } catch (err) {
    return null;
  }
}

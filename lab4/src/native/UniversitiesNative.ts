import {NativeModules} from 'react-native';

export type University = {
  name: string;
  country: string;
  alphaTwoCode: string;
  webPages: string[];
  domains: string[];
};

type LoadResult = {
  source: 'remote' | 'cache';
  items: University[];
};

type UniversitiesModuleType = {
  loadUniversities(country: string): Promise<LoadResult>;
};

const {UniversitiesModule} = NativeModules as {
  UniversitiesModule: UniversitiesModuleType;
};

export default UniversitiesModule;

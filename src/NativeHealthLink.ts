import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  //in case we want to add native code in the future
}

export default TurboModuleRegistry.getEnforcing<Spec>('HealthLink');

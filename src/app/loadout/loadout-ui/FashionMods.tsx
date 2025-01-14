import { PluggableInventoryItemDefinition } from 'app/inventory/item-types';
import { unlockedPlugSetItemsSelector } from 'app/inventory/selectors';
import { useD2Definitions } from 'app/manifest/selectors';
import { DEFAULT_ORNAMENTS, DEFAULT_SHADER } from 'app/search/d2-known-values';
import { RootState } from 'app/store/types';
import clsx from 'clsx';
import { PlugCategoryHashes } from 'data/d2/generated-enums';
import { useSelector } from 'react-redux';
import styles from './FashionMods.m.scss';
import PlugDef from './PlugDef';

// TODO: Consolidate with the one in FashionDrawer
export function FashionMods({
  modsForBucket,
  storeId,
}: {
  modsForBucket: number[];
  storeId?: string;
}) {
  const defs = useD2Definitions()!;
  const unlockedPlugSetItems = useSelector((state: RootState) =>
    unlockedPlugSetItemsSelector(state, storeId)
  );
  const isShader = (m: number) =>
    defs.InventoryItem.get(m)?.plug?.plugCategoryHash === PlugCategoryHashes.Shader;
  const shader = modsForBucket.find(isShader);
  const ornament = modsForBucket.find((m) => !isShader(m));

  const shaderItem = shader ? defs.InventoryItem.get(shader) : undefined;
  const ornamentItem = ornament ? defs.InventoryItem.get(ornament) : undefined;

  const defaultShader = defs.InventoryItem.get(DEFAULT_SHADER);
  const defaultOrnament = defs.InventoryItem.get(DEFAULT_ORNAMENTS[2]);

  const canSlotShader =
    shader !== undefined && (shader === DEFAULT_SHADER || unlockedPlugSetItems.has(shader));
  const canSlotOrnament =
    ornament !== undefined &&
    (DEFAULT_ORNAMENTS.includes(ornament) || unlockedPlugSetItems.has(ornament));

  return (
    <div className={clsx(styles.items, styles.unequipped)}>
      <PlugDef
        className={clsx({ [styles.missingItem]: !canSlotShader })}
        plug={(shaderItem ?? defaultShader) as PluggableInventoryItemDefinition}
      />
      <PlugDef
        className={clsx({ [styles.missingItem]: !canSlotOrnament })}
        plug={(ornamentItem ?? defaultOrnament) as PluggableInventoryItemDefinition}
      />
    </div>
  );
}

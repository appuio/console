import * as React from 'react';
import { TableData, TableRow, RowFunction } from '@console/internal/components/factory';
import { asAccessReview, Kebab, KebabOption } from '@console/internal/components/utils';
import { TemplateModel } from '@console/internal/models';
import { DASH, dimensifyRow, getDeletetionTimestamp } from '@console/shared';
import { deleteNICModal } from '../modals/delete-nic-modal/delete-nic-modal';
import { VirtualMachineModel } from '../../models';
import { asVM, isVMRunningOrExpectedRunning } from '../../selectors/vm';
import { isVM, isVMI } from '../../selectors/check-type';
import { VMLikeEntityKind } from '../../types/vmLike';
import { nicModalEnhanced } from '../modals/nic-modal/nic-modal-enhanced';
import { ValidationCell } from '../table/validation-cell';
import {
  VMNicRowActionOpts,
  NetworkBundle,
  NetworkSimpleData,
  NetworkSimpleDataValidation,
  VMNicRowCustomData,
} from './types';
import { PENDING_RESTART_LABEL } from '../../constants';

const menuActionEdit = (
  nic,
  network,
  vmLikeEntity: VMLikeEntityKind,
  { withProgress }: VMNicRowActionOpts,
): KebabOption => ({
  label: 'Edit',
  callback: () =>
    withProgress(
      nicModalEnhanced({
        isEditing: true,
        blocking: true,
        vmLikeEntity,
        nic,
        network,
      }).result,
    ),
  accessReview: asAccessReview(
    isVM(vmLikeEntity) ? VirtualMachineModel : TemplateModel,
    vmLikeEntity,
    'patch',
  ),
});

const menuActionDelete = (
  nic,
  network,
  vmLikeEntity: VMLikeEntityKind,
  { withProgress }: VMNicRowActionOpts,
): KebabOption => ({
  label: 'Delete',
  callback: () => withProgress(deleteNICModal({ nic, vmLikeEntity }).result),
  accessReview: asAccessReview(
    isVM(vmLikeEntity) ? VirtualMachineModel : TemplateModel,
    vmLikeEntity,
    'patch',
  ),
});

const getActions = (nic, network, vmLikeEntity: VMLikeEntityKind, opts: VMNicRowActionOpts) => {
  if (isVMI(vmLikeEntity) || isVMRunningOrExpectedRunning(asVM(vmLikeEntity))) {
    return [];
  }
  const actions = [menuActionEdit, menuActionDelete];
  return actions.map((a) => a(nic, network, vmLikeEntity, opts));
};

export type VMNicSimpleRowProps = {
  data: NetworkSimpleData;
  validation?: NetworkSimpleDataValidation;
  columnClasses: string[];
  actionsComponent: React.ReactNode;
  index: number;
  style: object;
  isPendingRestart?: boolean;
};

export const NicSimpleRow: React.FC<VMNicSimpleRowProps> = ({
  data: { name, model, networkName, interfaceType, macAddress },
  validation = {},
  columnClasses,
  actionsComponent,
  index,
  style,
  isPendingRestart,
}) => {
  const dimensify = dimensifyRow(columnClasses);

  return (
    <TableRow id={name} index={index} trKey={name} style={style}>
      <TableData className={dimensify()}>
        <ValidationCell
          validation={validation.name}
          additionalLabel={isPendingRestart ? PENDING_RESTART_LABEL : null}
        >
          {name}
        </ValidationCell>
      </TableData>
      <TableData className={dimensify()}>
        <ValidationCell validation={validation.model}>{model || DASH}</ValidationCell>
      </TableData>
      <TableData className={dimensify()}>
        <ValidationCell validation={validation.network}>{networkName || DASH}</ValidationCell>
      </TableData>
      <TableData className={dimensify()}>
        <ValidationCell validation={validation.interfaceType}>
          {interfaceType || DASH}
        </ValidationCell>
      </TableData>
      <TableData className={dimensify()}>
        <ValidationCell validation={validation.macAddress}>{macAddress || DASH}</ValidationCell>
      </TableData>
      <TableData className={dimensify(true)}>{actionsComponent}</TableData>
    </TableRow>
  );
};

export const NicRow: RowFunction<NetworkBundle, VMNicRowCustomData> = ({
  obj: { name, nic, network, ...restData },
  customData: { isDisabled, withProgress, vmLikeEntity, columnClasses, pendingChangesNICs },
  index,
  style,
}) => (
  <NicSimpleRow
    data={{ ...restData, name }}
    columnClasses={columnClasses}
    index={index}
    style={style}
    isPendingRestart={!!pendingChangesNICs?.has(name)}
    actionsComponent={
      <Kebab
        options={getActions(nic, network, vmLikeEntity, { withProgress })}
        isDisabled={
          isDisabled ||
          isVMI(vmLikeEntity) ||
          !!getDeletetionTimestamp(vmLikeEntity) ||
          isVMRunningOrExpectedRunning(asVM(vmLikeEntity))
        }
        id={`kebab-for-${name}`}
      />
    }
  />
);

import * as _ from 'lodash';
import { podRingLabel } from '../pod-ring-utils';
import {
  deployment,
  deploymentConfig,
  statefulSets,
  daemonSet,
  mockPod,
} from '../__mocks__/pod-utils-test-data';
import { ExtPodKind } from '../../types';

describe('pod-ring utils:', () => {
  it('should return proper title, subtitle for podRingLabel', () => {
    const deploymentWithReplicas = _.set(_.cloneDeep(deployment), 'spec.replicas', 2);
    const mockDeploymentData = _.set(deploymentWithReplicas, 'status.readyReplicas', 2);
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind]).title,
    ).toEqual('2');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind]).subTitle,
    ).toEqual('pods');
  });

  it('should return title scaled to 0, empty subtitle for podRingLabel when no pods exist', () => {
    const mockDeploymentData = _.set(_.cloneDeep(deployment), 'spec.replicas', 0);
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind]).title,
    ).toEqual('Scaled to 0');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind]).subTitle,
    ).toEqual('');
  });

  it('should return title 0, subtitle scaling to 2 and no titleComponent, subtitleComponent for podRingLabel when scaling from 1 to 2 pods', () => {
    const deploymentWithReplicas = _.set(_.cloneDeep(deployment), 'spec.replicas', 2);
    const mockDeploymentData = _.set(deploymentWithReplicas, 'status.readyReplicas', 1);
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind]).title,
    ).toEqual('1');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind]).subTitle,
    ).toEqual('scaling to 2');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind])
        .titleComponent,
    ).toEqual(undefined);
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind])
        .subTitleComponent,
    ).toEqual(undefined);
  });

  it('should return title 0, subtitle scaling to 1 and no titleComponent, subtitleComponent for podRingLabel when the first pod is being created', () => {
    const deploymentWithReplicas = _.set(_.cloneDeep(deployment), 'spec.replicas', 1);
    const mockDeploymentData = _.set(deploymentWithReplicas, 'status.readyReplicas', 0);
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind]).title,
    ).toEqual('0');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind]).subTitle,
    ).toEqual('scaling to 1');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind])
        .titleComponent,
    ).toEqual(undefined);
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPod as ExtPodKind])
        .subTitleComponent,
    ).toEqual(undefined);
  });

  it('should return title 0, subtitle scaling to 1 and no titleComponent, subtitleComponent for podRingLabel when pod count is 1 and status is pending', () => {
    const mockDeploymentData = _.set(_.cloneDeep(deployment), 'spec.replicas', 1);
    const mockPodData = _.set(_.cloneDeep(mockPod), 'status.phase', 'Pending');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPodData as ExtPodKind]).title,
    ).toEqual('0');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPodData as ExtPodKind])
        .subTitle,
    ).toEqual('scaling to 1');
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPodData as ExtPodKind])
        .titleComponent,
    ).toEqual(undefined);
    expect(
      podRingLabel(mockDeploymentData, mockDeploymentData.kind, [mockPodData as ExtPodKind])
        .subTitleComponent,
    ).toEqual(undefined);
  });

  it('should return proper title, subtitle for podRingLabel for Daemon sets', () => {
    const mockDaemonData = _.cloneDeep(daemonSet);
    expect(
      podRingLabel(mockDaemonData, mockDaemonData.kind, [mockPod as ExtPodKind]).title,
    ).toEqual('2');
    expect(
      podRingLabel(mockDaemonData, mockDaemonData.kind, [mockPod as ExtPodKind]).subTitle,
    ).toEqual('pods');
  });

  it('should return proper title, subtitle for podRingLabel for Deployment Config', () => {
    const deploymentConfigWithReplicas = _.set(_.cloneDeep(deploymentConfig), 'spec.replicas', 2);
    const mockDeploymentConfigData = _.set(deploymentConfigWithReplicas, 'status.readyReplicas', 2);
    expect(
      podRingLabel(mockDeploymentConfigData, mockDeploymentConfigData.kind, [mockPod as ExtPodKind])
        .title,
    ).toEqual('2');
    expect(
      podRingLabel(mockDeploymentConfigData, mockDeploymentConfigData.kind, [mockPod as ExtPodKind])
        .subTitle,
    ).toEqual('pods');
  });

  it('should return proper title, subtitle for podRingLabel for Stateful sets', () => {
    const statefulSetWithReplicas = _.set(_.cloneDeep(statefulSets), 'spec.replicas', 2);
    const mockStatefulSetData = _.set(statefulSetWithReplicas, 'status.readyReplicas', 2);
    expect(
      podRingLabel(mockStatefulSetData, mockStatefulSetData.kind, [mockPod as ExtPodKind]).title,
    ).toEqual('2');
    expect(
      podRingLabel(mockStatefulSetData, mockStatefulSetData.kind, [mockPod as ExtPodKind]).subTitle,
    ).toEqual('pods');
  });
});
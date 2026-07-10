import { darkSteel, titanium, copper, glass } from '../utils/materials.js';

export function createOpticalSpectrometer(THREE) {
    const group = new THREE.Group();
    group.name = "DeepSpaceOpticalSpectrometer";

    // Pedestal Mount
    const pedestalGeo = new THREE.CylinderGeometry(1, 1.5, 2, 32);
    const pedestal = new THREE.Mesh(pedestalGeo, darkSteel);
    pedestal.position.y = 1;
    group.add(pedestal);

    // Motorized Base
    const baseGroup = new THREE.Group();
    baseGroup.name = "MotorizedBase";
    baseGroup.position.y = 2;

    const baseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, titanium);
    base.position.y = 0.25;
    baseGroup.add(base);

    // Yoke
    const yokeGeo = new THREE.BoxGeometry(2.8, 2, 0.5);
    const yoke = new THREE.Mesh(yokeGeo, darkSteel);
    yoke.position.y = 1.5;
    baseGroup.add(yoke);

    // Sensor Housing (Tilts up and down)
    const housingGroup = new THREE.Group();
    housingGroup.name = "SensorHousing";
    housingGroup.position.y = 1.5;

    const housingGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const housing = new THREE.Mesh(housingGeo, titanium);
    housing.rotation.x = Math.PI / 2;
    housingGroup.add(housing);

    // Primary Lens
    const lensGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 32);
    const lens = new THREE.Mesh(lensGeo, glass);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 2.0;
    housingGroup.add(lens);

    // Copper Heat Sinks
    const sinkGeo = new THREE.BoxGeometry(0.2, 1.6, 2);
    const leftSink = new THREE.Mesh(sinkGeo, copper);
    leftSink.position.set(-0.9, 0, 0);
    housingGroup.add(leftSink);

    const rightSink = new THREE.Mesh(sinkGeo, copper);
    rightSink.position.set(0.9, 0, 0);
    housingGroup.add(rightSink);

    baseGroup.add(housingGroup);
    group.add(baseGroup);

    // Animations: Scanning Pan (Base) and Tilt (Housing)
    const panTimes = [0, 2, 4, 6, 8];
    const panQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 3);
    const panQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const panQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 3);
    
    const panValues = [
        panQ1.x, panQ1.y, panQ1.z, panQ1.w,
        panQ2.x, panQ2.y, panQ2.z, panQ2.w,
        panQ3.x, panQ3.y, panQ3.z, panQ3.w,
        panQ2.x, panQ2.y, panQ2.z, panQ2.w,
        panQ1.x, panQ1.y, panQ1.z, panQ1.w
    ];
    const panTrack = new THREE.QuaternionKeyframeTrack('MotorizedBase.quaternion', panTimes, panValues);

    const tiltTimes = [0, 4, 8];
    const tiltQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 6);
    const tiltQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 6);
    
    const tiltValues = [
        tiltQ1.x, tiltQ1.y, tiltQ1.z, tiltQ1.w,
        tiltQ2.x, tiltQ2.y, tiltQ2.z, tiltQ2.w,
        tiltQ1.x, tiltQ1.y, tiltQ1.z, tiltQ1.w
    ];
    const tiltTrack = new THREE.QuaternionKeyframeTrack('SensorHousing.quaternion', tiltTimes, tiltValues);

    const clip = new THREE.AnimationClip('DeepSpaceScan', 8, [panTrack, tiltTrack]);

    return { group, animationClips: [clip] };
}

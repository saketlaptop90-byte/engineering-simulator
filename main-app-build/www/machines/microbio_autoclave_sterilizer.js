import * as sharedMaterials from '../utils/materials.js';

export function createAutoclaveSterilizer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metal = sharedMaterials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const darkMetal = sharedMaterials.darkMetalMaterial || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.6 });
    const glass = sharedMaterials.glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true });
    const accent = sharedMaterials.accentMaterial || new THREE.MeshStandardMaterial({ color: 0xcc0000 });

    // Base stand
    const standGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const stand = new THREE.Mesh(standGeo, darkMetal);
    stand.position.set(0, 0.25, 0);
    group.add(stand);

    // Main chamber
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 2.5, 32);
    bodyGeo.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, metal);
    body.position.set(0, 1.5, 0);
    group.add(body);

    // Door mechanism
    const doorGroup = new THREE.Group();
    doorGroup.name = "AutoclaveDoor";
    doorGroup.position.set(1.25, 1.5, 1); // Hinge at the side
    
    const doorGeo = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    doorGeo.rotateZ(Math.PI / 2);
    const door = new THREE.Mesh(doorGeo, darkMetal);
    door.position.set(0, 0, -1); // Centered relative to chamber
    doorGroup.add(door);

    // Gauge
    const gaugeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    gaugeGeo.rotateZ(Math.PI / 2);
    const gauge = new THREE.Mesh(gaugeGeo, glass);
    gauge.position.set(0.1, 0, -1);
    doorGroup.add(gauge);

    const needleGroup = new THREE.Group();
    needleGroup.name = "GaugeNeedle";
    needleGroup.position.set(0.15, 0, -1);
    
    const needleGeo = new THREE.BoxGeometry(0.02, 0.2, 0.02);
    const needle = new THREE.Mesh(needleGeo, accent);
    needle.position.set(0, 0.1, 0);
    needleGroup.add(needle);
    doorGroup.add(needleGroup);

    group.add(doorGroup);

    // Animations
    const times = [0, 1, 4, 5, 6];
    
    // Door open/close
    const qOpen = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    const qClosed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const doorValues = [
        qOpen.x, qOpen.y, qOpen.z, qOpen.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w,
        qOpen.x, qOpen.y, qOpen.z, qOpen.w,
        qOpen.x, qOpen.y, qOpen.z, qOpen.w
    ];
    const doorTrack = new THREE.QuaternionKeyframeTrack('AutoclaveDoor.quaternion', times, doorValues);

    // Needle move
    const qLow = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const qHigh = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 0.8);
    const needleValues = [
        qLow.x, qLow.y, qLow.z, qLow.w,
        qLow.x, qLow.y, qLow.z, qLow.w,
        qHigh.x, qHigh.y, qHigh.z, qHigh.w,
        qLow.x, qLow.y, qLow.z, qLow.w,
        qLow.x, qLow.y, qLow.z, qLow.w
    ];
    const needleTrack = new THREE.QuaternionKeyframeTrack('GaugeNeedle.quaternion', times, needleValues);

    const clip = new THREE.AnimationClip('AutoclaveOperation', 6, [doorTrack, needleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}

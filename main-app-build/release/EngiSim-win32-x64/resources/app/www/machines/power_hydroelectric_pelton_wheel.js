import { 
  metalMaterial, 
  darkMetalMaterial, 
  copperMaterial, 
  insulatorMaterial, 
  casingMaterial, 
  highlightMaterial 
} from '../utils/materials.js';

export function createHydroelectricPeltonWheel(THREE) {
    const group = new THREE.Group();
    group.name = "HydroelectricPeltonWheel";

    const animationClips = [];

    // Base/Housing
    const baseGeom = new THREE.BoxGeometry(6, 1, 4);
    const base = new THREE.Mesh(baseGeom, darkMetalMaterial);
    base.position.y = 0.5;
    group.add(base);

    // Shaft Support
    const supportGeom = new THREE.BoxGeometry(1, 4, 1);
    const supportL = new THREE.Mesh(supportGeom, darkMetalMaterial);
    supportL.position.set(-2, 3, 0);
    group.add(supportL);

    const supportR = new THREE.Mesh(supportGeom, darkMetalMaterial);
    supportR.position.set(2, 3, 0);
    group.add(supportR);

    // Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.3, 0.3, 5, 16);
    const shaft = new THREE.Mesh(shaftGeom, metalMaterial);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.y = 4;
    group.add(shaft);

    // Wheel Assembly
    const wheelGroup = new THREE.Group();
    wheelGroup.name = "PeltonWheel";
    wheelGroup.position.set(0, 4, 0);
    group.add(wheelGroup);

    // Central Disk
    const diskGeom = new THREE.CylinderGeometry(2, 2, 0.4, 32);
    const disk = new THREE.Mesh(diskGeom, darkMetalMaterial);
    disk.rotation.z = Math.PI / 2;
    wheelGroup.add(disk);

    // Buckets
    const bucketGeom = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI, 0, Math.PI);
    const numBuckets = 16;
    for (let i = 0; i < numBuckets; i++) {
        const bucket = new THREE.Mesh(bucketGeom, metalMaterial);
        const angle = (i / numBuckets) * Math.PI * 2;
        bucket.position.set(0, Math.sin(angle) * 2.1, Math.cos(angle) * 2.1);
        bucket.rotation.x = angle;
        wheelGroup.add(bucket);
    }

    // Nozzle
    const nozzleGeom = new THREE.CylinderGeometry(0.2, 0.5, 2, 16);
    const nozzle = new THREE.Mesh(nozzleGeom, highlightMaterial);
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(0, 1.8, 3);
    group.add(nozzle);

    // Water Jet
    const jetGroup = new THREE.Group();
    jetGroup.name = "WaterJet";
    jetGroup.position.set(0, 1.8, 1.8);
    group.add(jetGroup);

    const jetGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const jet = new THREE.Mesh(jetGeom, casingMaterial);
    jet.rotation.x = Math.PI / 2;
    jetGroup.add(jet);

    // Animation: Wheel Rotation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 2);
    
    const trackName = `${wheelGroup.name}.quaternion`;
    const times = [0, 0.5, 1];
    const values = [...q1.toArray(), ...q2.toArray(), ...q3.toArray()];
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
    const clip1 = new THREE.AnimationClip('SpinWheel', 1, [track]);
    animationClips.push(clip1);

    // Animation: Water Jet Pulsation
    const jetScaleTrack = new THREE.VectorKeyframeTrack(
        `${jetGroup.name}.scale`,
        [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        [1,1,1, 1.1,1,1.1, 1,1,1, 1.1,1,1.1, 1,1,1, 1.1,1,1.1]
    );
    const clip2 = new THREE.AnimationClip('PulsateJet', 0.5, [jetScaleTrack]);
    animationClips.push(clip2);

    return { group, animationClips };
}

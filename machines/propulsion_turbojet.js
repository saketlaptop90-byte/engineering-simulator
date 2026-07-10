import { titanium, steel, copper } from '../utils/materials.js';

export function createTurbojet(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Casing (half cylinder cutaway for visibility)
    const casingGeo = new THREE.CylinderGeometry(2, 2, 10, 32, 1, true, 0, Math.PI);
    const casingMat = titanium.clone();
    casingMat.side = THREE.DoubleSide;
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.rotation.z = Math.PI / 2;
    group.add(casing);

    // Central Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 11, 16);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.rotation.z = Math.PI / 2;
    group.add(shaft);

    // Compressor Section
    const compressor = new THREE.Group();
    compressor.name = "compressor";
    for (let i = 0; i < 5; i++) {
        const stageGeo = new THREE.CylinderGeometry(0.3, 1.8, 0.1, 16, 1);
        const stage = new THREE.Mesh(stageGeo, steel);
        
        // Blades per stage
        for (let j = 0; j < 12; j++) {
            const bladeGeo = new THREE.BoxGeometry(0.05, 1.5, 0.3);
            const blade = new THREE.Mesh(bladeGeo, titanium);
            blade.position.y = 1.0;
            blade.rotation.y = (j / 12) * Math.PI * 2;
            blade.rotation.x = Math.PI / 6; // Pitch angle
            
            const pivot = new THREE.Group();
            pivot.rotation.y = (j / 12) * Math.PI * 2;
            pivot.add(blade);
            stage.add(pivot);
        }
        stage.position.y = -3 + i * 0.8;
        compressor.add(stage);
    }
    compressor.rotation.z = Math.PI / 2;
    group.add(compressor);

    // Combustion Chamber
    const chamberGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const chamber = new THREE.Mesh(chamberGeo, copper);
    chamber.rotation.z = Math.PI / 2;
    chamber.position.x = 1;
    group.add(chamber);

    // Turbine Section
    const turbine = new THREE.Group();
    turbine.name = "turbine";
    for (let i = 0; i < 2; i++) {
        const stageGeo = new THREE.CylinderGeometry(0.3, 1.8, 0.1, 16, 1);
        const stage = new THREE.Mesh(stageGeo, steel);
        
        // Blades per stage
        for (let j = 0; j < 16; j++) {
            const bladeGeo = new THREE.BoxGeometry(0.05, 1.5, 0.4);
            const blade = new THREE.Mesh(bladeGeo, titanium);
            blade.position.y = 1.0;
            blade.rotation.x = -Math.PI / 4; // Pitch angle
            
            const pivot = new THREE.Group();
            pivot.rotation.y = (j / 16) * Math.PI * 2;
            pivot.add(blade);
            stage.add(pivot);
        }
        stage.position.y = 3 + i * 1.0;
        turbine.add(stage);
    }
    turbine.rotation.z = Math.PI / 2;
    group.add(turbine);

    // Exhaust Plume
    const plumeGeo = new THREE.ConeGeometry(1.5, 5, 32);
    const plumeMat = new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.rotation.z = -Math.PI / 2;
    plume.position.x = 7.5;
    plume.name = "plume";
    group.add(plume);

    // Animations setup
    const times = Array.from({length: 11}, (_, i) => i * 0.1);
    const rotQuats = [];
    for(let i=0; i<=10; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (i/10) * Math.PI * 2);
        rotQuats.push(q.x, q.y, q.z, q.w);
    }

    const compTrack = new THREE.QuaternionKeyframeTrack('compressor.quaternion', times, rotQuats);
    const turbTrack = new THREE.QuaternionKeyframeTrack('turbine.quaternion', times, rotQuats);

    const plumeScaleTimes = [0, 0.5, 1];
    const plumeScaleValues = [1, 1, 1, 1.2, 1, 1.2, 1, 1, 1];
    const plumeScaleTrack = new THREE.VectorKeyframeTrack('plume.scale', plumeScaleTimes, plumeScaleValues);

    const clip = new THREE.AnimationClip('TurbojetOperation', 1, [compTrack, turbTrack, plumeScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}

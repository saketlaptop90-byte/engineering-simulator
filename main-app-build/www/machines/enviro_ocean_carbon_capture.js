import * as materials from '../utils/materials.js';

export function createDirectOceanCarbonCaptureSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Floating Platform
    const platformGeo = new THREE.CylinderGeometry(6, 6, 1, 32);
    const platformMat = materials.concreteMaterial || new THREE.MeshStandardMaterial({ color: 0x999999 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    group.add(platform);

    // Intake Pipe
    const pipeGeo = new THREE.CylinderGeometry(1, 1, 10, 16);
    const pipeMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x555555 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set(0, -5, 0);
    group.add(pipe);

    // Extraction Modules
    const modGeo = new THREE.BoxGeometry(2, 3, 2);
    const modMat = materials.paintedMetalMaterial || new THREE.MeshStandardMaterial({ color: 0x008855 });
    for(let i=0; i<4; i++) {
        const mod = new THREE.Mesh(modGeo, modMat);
        const angle = (i/4) * Math.PI * 2;
        mod.position.set(Math.cos(angle)*3, 2, Math.sin(angle)*3);
        group.add(mod);
    }

    // Central Processing Unit with spinning turbine inside
    const cpuGeo = new THREE.SphereGeometry(2, 32, 32);
    const cpuMat = materials.glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0xaaaaff, transparent: true, opacity: 0.4 });
    const cpu = new THREE.Mesh(cpuGeo, cpuMat);
    cpu.position.set(0, 3, 0);
    group.add(cpu);

    const turbineGroup = new THREE.Group();
    turbineGroup.name = 'turbine';
    turbineGroup.position.set(0, 3, 0);
    const turbineBladeGeo = new THREE.BoxGeometry(3.5, 0.5, 0.1);
    for(let i=0; i<4; i++) {
        const blade = new THREE.Mesh(turbineBladeGeo, pipeMat);
        blade.rotation.y = (i/4) * Math.PI * 2;
        turbineGroup.add(blade);
    }
    group.add(turbineGroup);

    // Turbine Animation
    const turbineTrack = new THREE.QuaternionKeyframeTrack(
        'turbine.quaternion',
        [0, 1],
        [
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0).toArray(),
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2).toArray()
        ].flat()
    );
    animationClips.push(new THREE.AnimationClip('SpinTurbine', 1, [turbineTrack]));

    return { group, animationClips };
}

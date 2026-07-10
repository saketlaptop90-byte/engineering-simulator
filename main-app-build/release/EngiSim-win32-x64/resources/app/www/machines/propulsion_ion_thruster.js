import { titanium, steel, copper } from '../utils/materials.js';

export function createIonThruster(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer Shell
    const shellGeo = new THREE.CylinderGeometry(1.5, 1.2, 3, 32);
    const shellMat = titanium.clone();
    shellMat.wireframe = true;
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.rotation.z = Math.PI / 2;
    group.add(shell);

    // Electron Emitting Cathode
    const cathodeGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const cathode = new THREE.Mesh(cathodeGeo, copper);
    cathode.rotation.z = Math.PI / 2;
    cathode.position.x = -1.5;
    group.add(cathode);

    // Magnetic Rings (Hall Effect confinement)
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(1.3, 0.1, 16, 32);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = -1 + i * 1;
        group.add(ring);
    }

    // Grid (Accelerator)
    const gridGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
    const gridMat = steel.clone();
    gridMat.transparent = true;
    gridMat.opacity = 0.5;
    
    const grid1 = new THREE.Mesh(gridGeo, gridMat);
    grid1.rotation.z = Math.PI / 2;
    grid1.position.x = 1.4;
    group.add(grid1);

    const grid2 = new THREE.Mesh(gridGeo, gridMat);
    grid2.rotation.z = Math.PI / 2;
    grid2.position.x = 1.6;
    group.add(grid2);

    // Xenon Ion Plume
    const plumeGeo = new THREE.CylinderGeometry(1.2, 0.2, 6, 32);
    const plumeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.rotation.z = -Math.PI / 2;
    plume.position.x = 4.6;
    plume.name = "ionPlume";
    group.add(plume);
    
    // Internal Plasma Particles
    const particleGroup = new THREE.Group();
    particleGroup.name = "particles";
    for(let i=0; i<30; i++) {
        const pGeo = new THREE.SphereGeometry(0.03, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
        const p = new THREE.Mesh(pGeo, pMat);
        p.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
        particleGroup.add(p);
    }
    group.add(particleGroup);

    // Animations
    const times = [0, 0.5, 1];
    const plumeScaleValues = [1, 1, 1, 1.05, 1.05, 1.05, 1, 1, 1];
    const plumeTrack = new THREE.VectorKeyframeTrack('ionPlume.scale', times, plumeScaleValues);

    const particleTimes = Array.from({length: 21}, (_, i) => i * 0.05);
    const particleRotQuats = [];
    for(let i=0; i<=20; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (i/20) * Math.PI * 2);
        particleRotQuats.push(q.x, q.y, q.z, q.w);
    }
    const particleTrack = new THREE.QuaternionKeyframeTrack('particles.quaternion', particleTimes, particleRotQuats);

    const clip = new THREE.AnimationClip('IonEmission', 1, [plumeTrack, particleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}

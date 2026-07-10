import { titanium, copper, gold, darkSteel } from '../utils/materials.js';

export function createSynchrotronLightSource(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Storage ring
    const ringGeo = new THREE.TorusGeometry(15, 1, 32, 100);
    const ring = new THREE.Mesh(ringGeo, darkSteel);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Undulators / Magnets and Beam lines
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        
        const magGeo = new THREE.BoxGeometry(3, 2, 4);
        const magnet = new THREE.Mesh(magGeo, i % 2 === 0 ? copper : titanium);
        magnet.position.set(Math.cos(angle) * 15, 0, Math.sin(angle) * 15);
        magnet.rotation.y = -angle;
        group.add(magnet);
        
        if (i % 3 === 0) {
            const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 10);
            const beamPipe = new THREE.Mesh(beamGeo, darkSteel);
            beamPipe.position.set(Math.cos(angle) * 20, 0, Math.sin(angle) * 20);
            beamPipe.rotation.z = Math.PI / 2;
            beamPipe.rotation.y = -angle;
            group.add(beamPipe);
        }
    }

    // Electron bunch
    const electronGroup = new THREE.Group();
    electronGroup.name = 'electronGroup';
    const eGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const electron = new THREE.Mesh(eGeo, eMat);
    electron.position.set(15, 0, 0);
    electronGroup.add(electron);
    group.add(electronGroup);

    // Animation: Electron bunch traveling around the ring
    const times = [0, 1, 2, 3, 4];
    const vals = [
        0, 0, 0,
        0, Math.PI / 2, 0,
        0, Math.PI, 0,
        0, Math.PI * 1.5, 0,
        0, Math.PI * 2, 0
    ];
    const track = new THREE.VectorKeyframeTrack('electronGroup.rotation', times, vals);
    const clip = new THREE.AnimationClip('Circulate', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}

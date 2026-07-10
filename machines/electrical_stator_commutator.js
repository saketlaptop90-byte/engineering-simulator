import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createStatorCommutator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Stator (darkSteel)
    const statorGeom = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(0, -2, 0),
            new THREE.Vector3(-2, 0, 0)
        ], true),
        64, 0.5, 8, true
    );
    const stator = new THREE.Mesh(statorGeom, darkSteel);
    group.add(stator);

    // Windings (copper)
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const winding = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.2, 16, 32), copper);
        winding.position.set(Math.cos(angle)*2, Math.sin(angle)*2, 0);
        winding.lookAt(0,0,0);
        winding.rotation.y = Math.PI / 2;
        group.add(winding);
    }

    // Rotor & Commutator
    const rotorGroup = new THREE.Group();
    rotorGroup.name = 'rotorGroup';
    group.add(rotorGroup);

    const shaftGeom = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    const shaft = new THREE.Mesh(shaftGeom, darkSteel);
    shaft.rotation.x = Math.PI / 2;
    rotorGroup.add(shaft);

    const commutatorGeom = new THREE.CylinderGeometry(0.8, 0.8, 2, 12); // segmented look
    const commutator = new THREE.Mesh(commutatorGeom, brass);
    commutator.rotation.x = Math.PI / 2;
    commutator.position.z = 2;
    rotorGroup.add(commutator);
    
    // Brushes (porcelain/darkSteel base)
    const brushGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const brushTop = new THREE.Mesh(brushGeom, darkSteel);
    brushTop.position.set(0, 1.1, 2);
    group.add(brushTop);
    
    const brushBottom = new THREE.Mesh(brushGeom, darkSteel);
    brushBottom.position.set(0, -1.1, 2);
    group.add(brushBottom);

    // Animation (spinning)
    const times = [0, 2];
    const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI * 2));
    
    const track = new THREE.QuaternionKeyframeTrack(
        'rotorGroup.quaternion',
        times,
        [...qStart.toArray(), ...qEnd.toArray()]
    );
    const clip = new THREE.AnimationClip('Spin', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}

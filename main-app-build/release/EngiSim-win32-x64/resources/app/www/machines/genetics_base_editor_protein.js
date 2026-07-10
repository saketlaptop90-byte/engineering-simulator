import { materials } from '../utils/materials.js';

export function createBaseEditorProtein(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const editorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x20b2aa,
        roughness: 0.2,
        clearcoat: 0.8,
    });

    const deaminaseMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff1493,
        roughness: 0.5,
    });

    const dnaMaterial = materials.gold || new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2
    });

    // Main Cas9 Nickase body
    const cas9Geom = new THREE.BoxGeometry(3, 2, 2, 4, 4, 4);
    const cas9Nickase = new THREE.Mesh(cas9Geom, editorMaterial);
    group.add(cas9Nickase);

    // Deaminase domain
    const deaminaseGeom = new THREE.SphereGeometry(1, 32, 32);
    const deaminase = new THREE.Mesh(deaminaseGeom, deaminaseMaterial);
    deaminase.position.set(-1.5, 1.5, 0);
    group.add(deaminase);

    // DNA helix segment
    const helix = new THREE.Group();
    for(let i=0; i<10; i++) {
        const bpGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
        const bp = new THREE.Mesh(bpGeom, dnaMaterial);
        bp.position.set(-2.5 + i * 0.5, -1, 0);
        bp.rotation.x = i * Math.PI / 5;
        helix.add(bp);
    }
    group.add(helix);

    // Animations: Deaminase swinging into position
    const deaminaseRotTrack = new THREE.QuaternionKeyframeTrack(
        deaminase.uuid + '.quaternion',
        [0, 1.5, 3],
        [...new THREE.Quaternion().toArray(),
         ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 4)).toArray(),
         ...new THREE.Quaternion().toArray()]
    );

    const clip = new THREE.AnimationClip('Base_Editing', 3, [deaminaseRotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}

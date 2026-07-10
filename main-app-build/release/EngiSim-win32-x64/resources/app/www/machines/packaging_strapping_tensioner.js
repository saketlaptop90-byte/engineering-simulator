import { getMaterials } from '../utils/materials.js';

export function createStrappingMachineTensioner(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Tensioner Body
    const bodyGeo = new THREE.BoxGeometry(2, 2, 1.5);
    const body = new THREE.Mesh(bodyGeo, materials.steel);
    group.add(body);

    // Tensioning wheel
    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    wheelGeo.rotateX(Math.PI / 2);
    const wheel = new THREE.Mesh(wheelGeo, materials.aluminum);
    wheel.position.set(-0.5, 1, 0.8);
    wheel.name = 'tensionWheel';
    group.add(wheel);

    // Strap
    const strapGeo = new THREE.PlaneGeometry(4, 0.2);
    const strap = new THREE.Mesh(strapGeo, materials.plastic);
    strap.position.set(0, 1.5, 0.8);
    group.add(strap);

    // Cutter blade
    const bladeGeo = new THREE.BoxGeometry(0.1, 0.5, 0.4);
    const blade = new THREE.Mesh(bladeGeo, materials.steel);
    blade.position.set(0.5, 1.5, 0.8);
    blade.name = 'cutterBlade';
    group.add(blade);

    // Animations (Using Vector for rotation euler or position)
    // We animate the blade cutting down
    const bladeTimes = [0, 1.8, 2, 2.2];
    const bladeValues = [0.5, 1.5, 0.8,  0.5, 1.5, 0.8,  0.5, 1.2, 0.8,  0.5, 1.5, 0.8];
    const bladeTrack = new THREE.VectorKeyframeTrack('cutterBlade.position', bladeTimes, bladeValues);

    const actionClip = new THREE.AnimationClip('StrappingAction', 2.2, [bladeTrack]);
    animationClips.push(actionClip);

    return { group, animationClips };
}

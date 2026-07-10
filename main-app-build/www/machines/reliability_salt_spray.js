import * as materials from '../utils/materials.js';

export function createSaltSprayCorrosionTester(THREE) {
    const group = new THREE.Group();

    // Main tank
    const tankGeo = new THREE.BoxGeometry(5, 3, 3);
    const tankMat = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.9 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.y = 1.5;
    group.add(tank);

    // Transparent lid (angled)
    const lidGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 32, 1, false, 0, Math.PI);
    const lidMat = materials.transparentPlastic || new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.6, roughness: 0.2 });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 3, 0);
    group.add(lid);

    // Mist representation (pulsating opacity/scale)
    const mistGeo = new THREE.BoxGeometry(4.8, 1.4, 2.8);
    const mistMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const mist = new THREE.Mesh(mistGeo, mistMat);
    mist.position.set(0, 3.5, 0);
    group.add(mist);

    // Animations
    const animationClips = [];
    const times = [0, 1, 2];
    const opacityValues = [0.2, 0.5, 0.2];
    
    // Animate material opacity
    const opacityTrack = new THREE.NumberKeyframeTrack(mist.material.uuid + '.opacity', times, opacityValues);
    const clip = new THREE.AnimationClip('saltSpray', 2, [opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}

import { materials } from '../utils/materials.js';

export function createUVCuringArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Conveyor base
    const conveyorGeo = new THREE.BoxGeometry(5, 0.5, 2);
    const conveyor = new THREE.Mesh(conveyorGeo, materials?.steel || new THREE.MeshStandardMaterial({color: 0x666666}));
    group.add(conveyor);

    // Lamp Housing
    const housingGeo = new THREE.BoxGeometry(3, 1, 2.2);
    const housingMat = materials?.plastic || new THREE.MeshStandardMaterial({color: 0xeeeeee});
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.y = 1.5;
    group.add(housing);

    const lampMat = new THREE.MeshBasicMaterial({color: 0x8a2be2, transparent: true, opacity: 0.5});
    
    const tracks = [];

    for (let i = -1; i <= 1; i++) {
        const lampGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
        const lamp = new THREE.Mesh(lampGeo, lampMat.clone());
        lamp.name = `UVLamp_${i}`;
        lamp.rotation.x = Math.PI / 2;
        lamp.position.set(i, 1.1, 0);
        group.add(lamp);
        
        // Pulse lamps
        const times = [0, 0.5 + Math.abs(i)*0.2, 1, 1.5 + Math.abs(i)*0.2, 2];
        const values = [0.2, 1.0, 0.2, 1.0, 0.2];
        const track = new THREE.NumberKeyframeTrack(`${lamp.name}.material.opacity`, times, values);
        tracks.push(track);
    }
    
    // Product moving on conveyor
    const productGeo = new THREE.BoxGeometry(0.8, 0.1, 1);
    const productMat = new THREE.MeshStandardMaterial({color: 0xffffff});
    const product = new THREE.Mesh(productGeo, productMat);
    product.name = "Product";
    group.add(product);
    
    const prodTimes = [0, 2];
    const prodValues = [-2.5, 0.3, 0,  2.5, 0.3, 0];
    const trackProduct = new THREE.VectorKeyframeTrack('Product.position', prodTimes, prodValues);
    tracks.push(trackProduct);

    const clip = new THREE.AnimationClip('cure', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}

export function createBiosignatureAnalyzer(THREE) {
    const group = new THREE.Group();
    
    const baseMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.7,
        roughness: 0.2
    });
    
    // Main body
    const bodyGeo = new THREE.BoxGeometry(3, 2, 2);
    const body = new THREE.Mesh(bodyGeo, baseMat);
    group.add(body);
    
    // Sensor dish
    const dishGeo = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const dishMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1,
        side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 1.5, 0);
    dish.rotation.x = -Math.PI / 4;
    group.add(dish);
    
    // Scan animation (dish sweeping)
    const times = [0, 2, 4];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/4, -Math.PI/4, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/4, Math.PI/4, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/4, -Math.PI/4, 0));
    
    dish.name = "dish";
    
    const rotTrack = new THREE.QuaternionKeyframeTrack('dish.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ]);
    
    const clip = new THREE.AnimationClip('scan', 4, [rotTrack]);
    
    return { group, animationClips: [clip] };
}

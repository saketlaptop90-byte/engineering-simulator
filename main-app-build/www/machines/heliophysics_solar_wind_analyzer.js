export function createSolarWindAnalyzer(THREE) {
    const group = new THREE.Group();
    
    // Base
    const baseGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Sensor Array
    const sensorGeo = new THREE.BoxGeometry(3, 1, 3);
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, metalness: 0.3, roughness: 0.4 });
    const sensor = new THREE.Mesh(sensorGeo, sensorMat);
    sensor.position.y = 1;
    group.add(sensor);
    
    // Rotating Dish
    const dishGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.1, side: THREE.DoubleSide });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.y = 2.5;
    dish.rotation.x = Math.PI;
    dish.name = 'Dish';
    group.add(dish);

    // Animations
    const times = [0, 2, 4];
    const values = [0, Math.PI, Math.PI * 2];
    
    const namedTrack = new THREE.NumberKeyframeTrack('Dish.rotation[y]', times, values);
    const namedClip = new THREE.AnimationClip('analyze_dish', 4, [namedTrack]);

    return { group, animationClips: [namedClip] };
}

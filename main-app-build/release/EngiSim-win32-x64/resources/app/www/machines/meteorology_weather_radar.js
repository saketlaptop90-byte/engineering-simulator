export function createWeatherRadar(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 2;
    group.add(base);

    const supportGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const supportMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6, roughness: 0.4 });
    const support = new THREE.Mesh(supportGeo, supportMat);
    support.name = "radarSupport";
    support.position.y = 5;
    
    const dishGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.2, roughness: 0.8, side: THREE.DoubleSide });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI / 2;
    dish.position.y = 1;
    support.add(dish);

    group.add(support);

    const times = [0, 2, 4];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
    ];

    const radarTrack = new THREE.QuaternionKeyframeTrack('radarSupport.quaternion', times, values);
    const clip = new THREE.AnimationClip('RadarSweep', 4, [radarTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}

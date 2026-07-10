export function createDopplerRadar(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.3, roughness: 0.7 });
    const domeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.5, transparent: true, opacity: 0.8 });
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });

    // Tower Base
    const baseGeo = new THREE.CylinderGeometry(2, 2.5, 8, 32);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 4;
    group.add(base);

    // Radome
    const domeGeo = new THREE.SphereGeometry(3, 32, 32);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 9;
    group.add(dome);

    // Radar Dish inside Radome
    const radarGroup = new THREE.Group();
    radarGroup.position.y = 9;
    radarGroup.name = "radarDish";
    group.add(radarGroup);

    const dishGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI / 2;
    dish.position.z = 0.5;
    radarGroup.add(dish);
    
    const feedGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const feed = new THREE.Mesh(feedGeo, dishMat);
    feed.rotation.x = Math.PI / 2;
    feed.position.z = 1.5;
    radarGroup.add(feed);

    // Animation
    const times = [0, 1, 2, 3, 4];
    const q = new THREE.Quaternion();
    const values = [];
    for(let i=0; i<=4; i++) {
        q.setFromAxisAngle(new THREE.Vector3(0,1,0), i * Math.PI / 2);
        values.push(q.x, q.y, q.z, q.w);
    }
    const track = new THREE.QuaternionKeyframeTrack("radarDish.quaternion", times, values);
    const clip = new THREE.AnimationClip("SpinRadar", 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}

export function createPunnettSquare(THREE) {
  const group = new THREE.Group();

  // 1. The Grid (2x2)
  const gridMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
  const gridGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-2, 0, 0), new THREE.Vector3(2, 0, 0),
    new THREE.Vector3(0, 2, 0), new THREE.Vector3(0, -2, 0)
  ]);
  const grid = new THREE.LineSegments(gridGeo, gridMat);
  group.add(grid);

  // Box to hold it all
  const bgMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), bgMat);
  bg.position.z = -0.1;
  group.add(bg);

  // 2. Parent Alleles (Mendelian Genetics: Pea Plants)
  // Heterozygous cross: Rr x Rr (R = Round/Red, r = Wrinkled/White)
  const textMatDom = new THREE.MeshBasicMaterial({ color: 0xff4444 }); // R
  const textMatRec = new THREE.MeshBasicMaterial({ color: 0x8888ff }); // r

  // We'll use 3D shapes to represent the alleles instead of text, since we don't have a font loader
  // Dom = Big Red Sphere (R)
  // Rec = Small Blue Box (r)

  const createDom = () => new THREE.Mesh(new THREE.SphereGeometry(0.3), textMatDom);
  const createRec = () => new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), textMatRec);

  // Parent 1 (Top: R, r)
  const p1_A = createDom(); p1_A.position.set(-1, 2.5, 0); group.add(p1_A);
  const p1_B = createRec(); p1_B.position.set(1, 2.5, 0); group.add(p1_B);

  // Parent 2 (Left: R, r)
  const p2_A = createDom(); p2_A.position.set(-2.5, 1, 0); group.add(p2_A);
  const p2_B = createRec(); p2_B.position.set(-2.5, -1, 0); group.add(p2_B);

  p1_A.userData = { id: 'parent1', name: 'Parent 1 Alleles', description: 'Heterozygous (Rr). Can give either R or r to the offspring.' };

  // 3. Offspring (The 4 squares)
  const squares = [
    { x: -1, y: 1, dom1: true, dom2: true },   // RR
    { x: 1, y: 1, dom1: false, dom2: true },   // rR -> Rr
    { x: -1, y: -1, dom1: true, dom2: false }, // Rr
    { x: 1, y: -1, dom1: false, dom2: false }  // rr
  ];

  const offGroup = new THREE.Group();
  group.add(offGroup);

  const offspringObjs = [];

  // 4. Phenotype representations (The actual pea)
  // R = Round/Red, rr = Wrinkled/White
  const domPea = new THREE.SphereGeometry(0.8);
  const recPea = new THREE.IcosahedronGeometry(0.7, 1); // rough/wrinkled
  const domColor = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const recColor = new THREE.MeshStandardMaterial({ color: 0xaaaaff });

  squares.forEach((sq, i) => {
    // Genotype representation
    const g1 = sq.dom1 ? createDom() : createRec();
    const g2 = sq.dom2 ? createDom() : createRec();
    
    g1.position.set(sq.x - 0.2, sq.y + 0.5, 0);
    g2.position.set(sq.x + 0.2, sq.y + 0.5, 0);
    
    // Phenotype (The trait expressed)
    const isDom = sq.dom1 || sq.dom2; // Rr or RR
    const pheno = new THREE.Mesh(isDom ? domPea : recPea, isDom ? domColor : recColor);
    pheno.position.set(sq.x, sq.y - 0.2, 0);

    // Group them
    const off = new THREE.Group();
    off.add(g1, g2, pheno);
    offGroup.add(off);
    offspringObjs.push({ group: off, baseScale: 1, startDelay: i * 1 });
    
    off.userData = { id: 'offspring_'+i, name: `Offspring ${i+1}`, description: isDom ? 'Dominant Phenotype (Red/Round). Genotype has at least one R.' : 'Recessive Phenotype (White/Wrinkled). Genotype is rr.' };
  });

  let timer = 0;

  group.userData.animate = function(delta) {
    timer += delta;

    // Pop in animation for the offspring
    offspringObjs.forEach(off => {
      if (timer > off.startDelay) {
        // scale up to 1
        const s = Math.min(1, off.group.scale.x + delta * 2);
        off.group.scale.set(s, s, s);
      } else {
        off.group.scale.set(0.001, 0.001, 0.001);
      }
    });

    if (timer > 6) {
      timer = 0; // reset loop
    }

    // Wiggle alleles
    p1_A.position.y = 2.5 + Math.sin(Date.now()*0.005)*0.1;
    p1_B.position.y = 2.5 + Math.cos(Date.now()*0.005)*0.1;
    p2_A.position.x = -2.5 + Math.sin(Date.now()*0.004)*0.1;
    p2_B.position.x = -2.5 + Math.cos(Date.now()*0.004)*0.1;
  };

  group.userData.quiz = [
    { question: "In a cross between two Heterozygous parents (Rr x Rr), what is the probability of having an offspring with the recessive trait (rr)?", options: ["0%", "25% (1 out of 4)", "50%", "75%"], answer: 1 },
    { question: "If 'R' is dominant for Red and 'r' is recessive for White, what color will an 'Rr' offspring be?", options: ["Red", "White", "Pink"], answer: 0 }
  ];

  return group;
}

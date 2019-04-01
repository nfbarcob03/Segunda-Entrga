//Laammada al file sistem
const fs = require ('fs');
//Lista de estudiantes
listaEstudiantes=[];
listaCursos=[];
listaUnCursos=[]

//Funciones para crear  estudiantes
const crear_curso = (curso) => {
	//La funcion listar trae el json ya guardao antes
	//Con registros anteriores
	listarCursos();
	let duplicadoNombre=listaCursos.find(cur=>cur.nombre==curso.nombre)
	let duplicadoId=listaCursos.find(cur=>cur._id==curso._id)
	if(!duplicadoNombre && !duplicadoId){
		listaCursos.push(curso);
		console.log(listaCursos);
		//La funcion guardar, en un archivo .json listaEstudiantes
		guardarCurso();
		return true;
	}else{
		console.log('Ya existe un curso con ese nombre o ese ID, no se puede crear');
		return false;
	}
}

//La funcion listar trae el json ya guardao antes
//Con registros anteriores
const listarCursos = ()=>{
	try{
		//Permanece mas en el tiempo, en caso de que sea constante
		listaCursos = require('./listado_cursos.json')
		//Si es modificado asincronicamente
		//listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
	}catch(error){
		listaCursos=[];
	}
}

const listarUnCursos = (doc_curso) => {
	try{
		//Permanece mas en el tiempo, en caso de que sea constante
		ubicacion='../' + doc_curso
		console.log(ubicacion)
		listaUnCursos = require(ubicacion)
		//Si es modificado asincronicamente
		//listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
	}catch(error){
		console.log("list nueva")
		listaUnCursos=[];
		fs.appendFile(doc_curso, listaUnCursos, function (err) {
  			if (err) throw err;
  			console.log('Saved!');
		});

	}
}
//Funcion para guardar en un JSON los estudiantes

const cambiarCurso = (idCurso)=>{
	listaCursos = require('./listado_cursos.json')
	let curs= listaCursos.find(buscar=>buscar._id==idCurso)
	if(!curs){
		console.log('El curso no existe')
		return false;
	}else{
		//Se asume que ingresa una materia valida
		if (curs.estado=="Disponible"){
			curs.estado="Cerrado";
		}else{
			curs.estado="Disponible";
		}
		guardarCurso()
		return true;
	}
}
const gurdarListaUnCurso=(doc_curso)=>{
	let datos=JSON.stringify(listaUnCursos);
		fs.writeFile(doc_curso, datos, (err)=>{
		if(err) throw(err);
		console.log('Archivo creado con exito');
	})
}

const guardarEstudianteCurso = (estudiante)=>{
	c=estudiante.curso.split(' ');
	let doc_curso=c[0] + '.json';
	listarUnCursos(doc_curso);
	console.log(listaUnCursos)
	let duplicadoId=listaUnCursos.find(est=>est.identificacion==estudiante.identificacion)
	let duplicadoNombre=listaUnCursos.find(est=>est.estudiante==estudiante.estudiante)
	if(!duplicadoId && !duplicadoNombre){
		console.log("entre no duplicado")
		listaUnCursos.push(estudiante);
		//La funcion guardar, en un archivo .json listaEstudiantes
		gurdarListaUnCurso(doc_curso);
		return true;
	}else{
		console.log('Ya existe un usuario con ese nombre o ese ID, no se puede crear');
		return false;
	}
	
}

const eliminarEstudiante = (estudiante)=>{
	c=estudiante.curso.split(' ');
	let doc_curso=c[0] + '.json';
	listarUnCursos(doc_curso);
	let nuevo= listaUnCursos.filter(est=> est.estudiante!=estudiante.estudiante)
	if(nuevo.length==listaUnCursos.length){
		console.log('Ninugn estudiante tiene ese nombre')
		return false;
	}else{
		listaUnCursos = nuevo
		gurdarListaUnCurso(doc_curso);
		return true;
	}
}

const guardarCurso=()=>{
	let datos=JSON.stringify(listaCursos);
	fs.appendFile('listado_cursos.json', datos, (err)=>{
		if(err) throw(err);
		console.log('Archivo creado con exito');
	})
}

const mostrar=()=>{
//Traigo la lista de estudiantes
	listar()
	console.log('Notas de los estudiantes');
	//Recorro la lista e imprimo con el foreach lo que me interesa
	listaEstudiantes.forEach(estudiante=>{
		console.log(estudiante.nombre);
		console.log('notas: ');
		console.log('matematicas ' + estudiante.matematicas );
		console.log('ingles ' + estudiante.ingles );
		console.log('programacion ' + estudiante.programacion + '\n' )

	});
}

const mostrarest=(nom)=>{
	listar()
	let est=listaEstudiantes.find(buscar=>buscar.nombre==nom)
	if(!est){
		console.log('no existe el estudiante')
	}else{
		console.log(est.nombre);
		console.log('notas: ');
		console.log('matematicas ' + est.matematicas );
		console.log('ingles ' + est.ingles );
		console.log('programacion ' + est.programacion + '\n' )
	}
}

const mostrarmat=()=>{
	listar()
	let ganan= listaEstudiantes.filter(mat=>mat.matematicas>=3)
	if(ganan.length==0){
		console.log('Ninugn estudiante gano matematicas')
	}else{
		ganan.forEach(estudiante=>{
		console.log(estudiante.nombre);
		console.log('notas: ');
		console.log('matematicas ' + estudiante.matematicas +'\n' );
	});
	}
}

const promedioest=(nom)=>{
	listar()
	let est=listaEstudiantes.find(buscar=>buscar.nombre==nom)
	if(!est){
		console.log('no existe el estudiante')
	}else{
		let promedio= (est.matematicas+est.ingles+est.programacion)/3
		console.log('El promedio del estudiante es: '+ promedio);
	}
}

const promediopasan=()=>{
	listar()
	let ganan= listaEstudiantes.filter(est=>((est.matematicas+est.ingles+est.programacion)/3)>=3)
	if(ganan.length==0){
		console.log('Ninugn estudiante tiene promedio superior a 3')
	}else{
		ganan.forEach(estudiante=>{
		console.log(estudiante.nombre);
		console.log('Promedio: ');
		console.log(((estudiante.matematicas+estudiante.ingles+estudiante.programacion)/3) +'\n' );
	});
	}
}

const actualizar = (estudiante)=>{
	let nom = estudiante.nombre
	let asig = estudiante.asignatura
	let nota = estudiante.calificacion
	listar()
	let est=listaEstudiantes.find(buscar=>buscar.nombre==nom)
	if(!est){
		console.log('Estudiante no existe')
	}else{
		//Se asume que ingresa una materia valida
		est[asig]=nota;
		guardar()
	}
}

const eliminar = (nom)=>{
	listar()
	let nuevo= listaEstudiantes.filter(est=> est.nombre!=nom)
	if(nuevo.length==listaEstudiantes.length){
		console.log('Ninugn estudiante tiene ese nombre')
	}else{
		listaEstudiantes = nuevo
		guardar()
	}
}


//Se exporta las funciones parea que otros scrips los utilicen
module.exports = {
	crear_curso,
	eliminarEstudiante,
	cambiarCurso,
	guardarEstudianteCurso,
	mostrar,
	mostrarest,
	mostrarmat,
	promedioest,
	promediopasan,
	actualizar,
	eliminar
}
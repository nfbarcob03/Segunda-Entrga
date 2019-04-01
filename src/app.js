const alert = require('alert-node');
const express= require('express');
const app = express();
const path= require('path');
const hbs=require('hbs');
const bodyParser=require('body-parser');


require('./helpers')
const funciones=require('./funciones');


const directoriopublico = path.join(__dirname, '../public');
const directoriopartial = path.join(__dirname, '../partials');
const dirNode_modules = path.join(__dirname , '../node_modules')
const dirViews = path.join(__dirname, '../templates/views')
const dirPartials = path.join(__dirname, '../templates/partials')



app.use(express.static(directoriopublico));
app.use(bodyParser.urlencoded({extended:false}))
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

hbs.registerPartials(dirPartials)
app.set('views', dirViews)
app.set('view engine', 'hbs');
app.get('/',(req,res)=>{
	res.render('index',{
		titulo:'Inicio'
	});
});

app.post('/calculos', (req, res)=>{
	res.render('calculos', {
		titulo:'Promedio Estudiante ',
		estudiante: req.body.nombre,
		nota1:parseInt(req.body.nota1),
		nota2:parseInt(req.body.nota2),
		nota3:parseInt(req.body.nota3)
	})
})

app.post('/eliminarEstudiante', (req, res)=>{
	let identificacion=req.body.identificacion;
	let estudiante=req.body.nombre;
	let email=req.body.email;
	let telefono=req.body.tel;
	let curso=req.body.curso;
	let est={estudiante:estudiante, identificacion:identificacion.toString(), email:email, telefono:telefono, curso:curso};
	let exito=funciones.eliminarEstudiante(est);
	if(exito){
		console.log("listo")
		res.render('listadoInscritos',{
		titulo:'Listado de los Cursos'
	})
	}
	else{
		res.render('errorCurso',{
		titulo:'Error'
	});
	}
	
})

app.get('/crearCursos', (req, res)=>{
	res.render('crearCursos', {
		titulo:'Cree un nuevo curso de Educacíon Continua '
		})
})

app.get('/inscripcion', (req, res)=>{
	res.render('inscripcion', {
		titulo:'Inacribase a un curso de Educación Continua '
		})
})



app.post('/inscribir', (req, res)=>{
	estudiante= req.body.nombre;
	identificacion=req.body.identificacion;
	email=req.body.email;
	telefono=req.body.telefono;
	curso=req.body.cursoSelect;
	let est={estudiante:estudiante, identificacion:identificacion.toString(), email:email, telefono:telefono, curso:curso};
	let creacionExitosa=funciones.guardarEstudianteCurso(est)
	if (creacionExitosa){
		res.render('exitosa', {
		titulo:'Inscripcion exitosa al Curso: '+curso
	});
	}else{
  		res.render('errorCurso',{
		titulo:'Error'
	});
	}
	
})

app.post('/cambioEstado', (req, res)=>{
	idCurso=req.body.cursoSelect;
	let creacionExitosa=funciones.cambiarCurso(idCurso)
	if (creacionExitosa){
		res.render('listar_cursos',{
		titulo:'Listado de Cursos'
	});
	}else{
  		res.render('errorCurso',{
		titulo:'Error'
	});
	}
	
})

app.get('/verInscriptos', (req,res)=>{
	res.render('listadoInscritos',{
		titulo:'Listado de los Cursos'
	})
})


app.post('/crearCurso', (req, res)=>{
	nombreCurso= req.body.nombreCurso,
	_id=parseInt(req.body._id);
	descripcionCurso=req.body.descripcionCurso,
	valorCurso=parseInt(req.body.valorCurso);
	if (!req.body.modalidad){
		modalidadCurso='--';
	}else{
		modalidadCurso=req.body.modalidad;
	}
	if (!req.body.intensidadHoraria){
		intensidadHorariaCurso='--';
	}else{
		intensidadHorariaCurso=req.body.intensidadHoraria;
	}
	let curso={nombre:nombreCurso, _id: _id, descripcion:descripcionCurso, valor:valorCurso, modalidad:modalidadCurso, intensidad: intensidadHorariaCurso, estado:"Disponible"};
	let creacionExitosa=funciones.crear_curso(curso)
	if (creacionExitosa){
		res.render('listar_cursos',{
		titulo:'Listado de Cursos'
	});
	}else{
  		res.render('errorCurso',{
		titulo:'Error'
	});
	}
	})

app.get('/listado', (req,res)=>{
	res.render('listado',{
		titulo:'Listado'
	})
})

app.get('/listar_cursos', (req,res)=>{
	res.render('listar_cursos',{
		titulo:'Listado de Cursos'
	})
})


app.get('*', (req,res)=>{
	res.render('error',{
		titulo:'Error'
	})
})

app.listen(3000,()=>{
	console.log('escuchando en puerto 3000')
});
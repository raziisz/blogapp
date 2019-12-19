const router = require("express").Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("Página de posts");
});

router.get("/categorias", (req, res) => {

  Categoria.find().sort({createdAt: 'desc'}).then(categorias =>{
    res.render('admin/categorias', {categorias})
  }).catch(err => {
    req.flash('error_msg', 'Houve um erro ao listar as categorias')
    console.log('Error ' + err)
    res.redirect('/admin')
  })
  
});

router.get("/categorias/addcategorias", (req, res) => {
  res.render("admin/addcategorias");
});

router.post("/categorias/nova", (req, res) => {
  let erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  )
    erros.push({ texto: "Nome inválido" });

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  )
    erros.push({ texto: "slug inválido" });

  if (req.body.nome.length < 2 && req.body.nome.length > 0)
    erros.push({ texto: "Nome da categoria é muito pequeno" });

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros });
  } else {
    const { nome, slug } = req.body;
    const novaCategoria = {
      nome,
      slug
    };

    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash('success_msg', 'Categoria criada com sucesso')
        res.redirect('/admin/categorias')
        })
      .catch(err => {
        req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente')
        res.redirect('/admin')
      });
  }
});

router.get('/categorias/edit/:id', (req, res) => {
  Categoria.findOne({_id: req.params.id}).then((categoria) => {
    res.render('admin/editcategorias', {categoria})
  }).catch((err) => {
    req.flash('error_msg', 'Categoria não existe')
    res.redirect('/admin/categorias')
  })
})

router.post('/categorias/edit', (req, res) => {
  let erros = [];
  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  )
    erros.push({ texto: "Nome inválido" });

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  )
    erros.push({ texto: "Slug inválido" });

  if (req.body.nome.length < 2 && req.body.nome.length > 0)
    erros.push({ texto: "Nome da categoria é muito pequeno" });

  if (erros.length > 0) {
    categoria = req.body
    res.render("admin/editcategorias", { erros, categoria });
  } else {
    const { nome, slug, _id } = req.body;

    Categoria.findOne({_id: _id}).then((categoria) => {
      categoria.nome = nome
      categoria.slug = slug

      categoria.save().then(() => {
        req.flash('success_msg', 'Categoria atualizada com sucesso')
        res.redirect('/admin/categorias')
      }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria')
        res.redirect('/admin/categorias')
      })
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao editar a categoria')
      res.redirect('/admin/categorias')
    })
  }
})

router.post('/categorias/deletar', (req, res) => {
  const {id} = req.body
  Categoria.remove({_id: id}).then(() => {
    req.flash('success_msg', 'Categoria foi deletada com sucesso')
    res.redirect('/admin/categorias')
  }).catch((err) => {
    req.flash('error_msg', 'Houve um error ao deletar a categoria')
    res.redirect('/admin/categorias')
  })
})

router.get('/postagens', (req,res) => {
  res.render('admin/postagens')
})

router.get('/postagens/add', (req,res) => {
  Categoria.find().then((categorias) => {
    res.render('admin/addpostagens', {categorias})
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro em carregar o formulário')
    res.redirect('/admin')
  })
})
module.exports = router;

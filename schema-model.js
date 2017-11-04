sectors {
  id
  name
  description
  created_at
  updated_at
}

statuses {
  id
  name
  created_at
  updated_at
}

warehouses {
  id
  name
  description
  address
  telephone
  working_hours
  attendant
  created_at
  updated_at
}

user {
  id
  type
  first_name
  last_name
  birthday
  dni
  address: {
    street
    zip
    city
    country
  }
  phone: {
    phone,
    celphone
  }
  email
  circle_id
  name_iva
  zone
  login: {
    encrypted_password
    reset_password_token
    reset_password_sent_at
    remember_created_at
    sign_in_count
    current_sign_in_at
    last_sign_in_at
    current_sign_in_ip
    last_sign_in_ip
    confirmed_at
    confirmation_token
    confirmation_sent_at
    unconfirmed_email
  }
  codigo_vendedor
  tipo_operacion
  inscripcion_iva
  tipo_identificacion
  numero_identificacion
  numero_ingresos_brutos
  codigo_transporte
  codigo_clasificacion
  created_at
  updated_at
}

suppliers {
  id
  name
  address
  nature
  business_name
  address: {
    street
    zip
    city
    country
  }
  phone: {
    phone,
    celphone
  }
  contact_name
  email
  web
  latitude
  longitude
  error_code
  description
  logo
  video
  active
  operation_type
  iva_condition
  identity_type
  identity_number
  inscription_number
  created_at
  updated_at
}

accounts {
  id
  user: User._id
  status
  balance
  created_at
  updated_at
}

// tokens de las redes sociales
identities {
  id
  user_id --> User._id
  provider
  uid
  token
  secret
  refresh_token
  name
  email
  nickname
  image
  phone
  urls
  expires_at
  created_at
  updated_at
}

-------------
purchases {
  id
  name
  description
  type
  dates: {
    purchase: {
     start
     end
    }
    payment: {
      start
      end
    }
    setup: {
      start
      end
    }
    delivery
  }
}

circles {
  id
  coordinator: User._id
  purchases: {
    Purchase_1._id: { --> circulos_compras
      user_id
      warehouses_id
      checkpoint
      delivery_time
      created_at
      updated_at
    },
    Purchase_X._id: {
      user_id
      warehouses_id
      checkpoint
      delivery_time
      created_at
      updated_at
    }
  }
  created_at
  updated_at
}

-------------
categories {
  id
  name
  description
  parent: Categoria._id
  children: [Categoria._id]
  products:[Product._id] --> usar categoria_productos
  created_at
  updated_at
}

productos {
  id
  precio
  nombre
  remito_name
  descripcion
  cantidad_permitida
  imagen
  precio_super
  supplier_id
  codigo
  oculto
  sale_type
  orden
  highlight
  faltante
  pack
  stock
  orden_remito
  costo
  moneda
  margen
  alicuota
  categories: [Categories._id] --> usar categoria_productos
  created_at
  updated_at
}

--------------
--------------
pedidos {
  id
  lines --> se reemplaza con pedidos_details
  usuario_id
  circulo_id
  compra_id
  total_discount
  total
  total_products
  invoice_number
  invoice_date
  active
  saving
  created_at
  updated_at
}

pedidos_details {
    id
    pedido_id
    invoice_id
    warehouse
    mai_id
    supplier_id
    supplier_name
    product_id
    product_codigo
    product_name
    product_qty
    product_price
    total_line
    created_at
    updated_at
}
-------------
// se guardan notas de credito/debito
transactions {
  id
  account_id
  pedido_id
  transaction_type
  amount
  description
  parent_id
  lines: [{ --> transaction_details
    product_id
    price
    quantity
    quantity
    subtotal
    created_at
    updated_at
  }]
  created_at
  updated_at
}

transaction_details {
  id
  transaction_id
  producto_id
  price
  quantity
  subtotal
  created_at
  updated_at
}
-------------

// vacia
media {
  id
  owner_id --> model polimorfico
  file
  resource_type
  status
  created_at
  updated_at
}

delivery_statuses {
  id
  delivery_id
  sector_id
  status_id
  created_at
  updated_at
}

// es para algo que se esta implementando
canastas_productos {
    id
    producto_id
    created_at
    updated_at
}

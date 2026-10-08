import React from 'react';
import { THALITA_PROFILE } from '@/data/biography';
import { BOOKS_CATALOG } from '@/data/books';
import { MOVIES_CATALOG } from '@/data/movies';

/**
 * StructuredData (Schema.org JSON-LD):
 * Fornece metadados semânticos estruturados para o Google Rich Results,
 * catalogando a entidade "Thalita Rebouças" (Person), sua bibliografia (Book / ItemList)
 * e adaptações audiovisuais (Movie / ItemList) sem duplicação de nós.
 */
export const StructuredData: React.FC = () => {
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://thalitareboucas.com.br/#author',
    name: THALITA_PROFILE.name,
    alternateName: ['Thalita Oliveira Rebouças', 'Thalita Reboucas'],
    url: 'https://thalitareboucas.com.br/',
    image: 'https://thalitareboucas.com.br/thalita-reboucas-portrait.jpg',
    description:
      'Escritora, jornalista, roteirista e apresentadora brasileira de literatura infanto-juvenil e pop, com mais de 25 livros publicados e mais de 2,3 milhões de exemplares vendidos.',
    birthDate: '1974-11-10',
    birthPlace: {
      '@type': 'Place',
      name: 'Rio de Janeiro, RJ, Brasil',
    },
    nationality: {
      '@type': 'Country',
      name: 'Brasil',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Pontifícia Universidade Católica do Rio de Janeiro (PUC-Rio)',
    },
    jobTitle: ['Escritora', 'Roteirista', 'Jornalista', 'Apresentadora'],
    sameAs: [
      THALITA_PROFILE.socials.instagram,
      THALITA_PROFILE.socials.twitter,
      THALITA_PROFILE.socials.tiktok,
      'https://pt.wikipedia.org/wiki/Thalita_Rebou%C3%A7as',
      'https://www.imdb.com/name/nm3867623/',
    ],
    award: [
      'Mais de 2,3 milhões de livros vendidos',
      'Recorde de 12 horas consecutivas de autógrafos na Bienal do Livro',
    ],
    knowsAbout: [
      'Literatura Juvenil',
      'Roteiro Cinematográfico',
      'Comédia Romântica',
      'Cultura Pop Brasileira',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Thalita Rebouças — Universo Interativo & Ateliê Biográfico',
    url: 'https://thalitareboucas.com.br/',
    inLanguage: 'pt-BR',
    description:
      'Experiência digital interativa biográfica de Thalita Rebouças, com estante de livros 3D, memórias da Bienal, cinema e conselhos afetivos.',
    author: {
      '@id': 'https://thalitareboucas.com.br/#author',
    },
  };

  const booksSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Bibliografia Oficial de Thalita Rebouças',
    description: 'Catálogo de obras literárias infanto-juvenis publicadas por Thalita Rebouças.',
    numberOfItems: BOOKS_CATALOG.length,
    itemListElement: BOOKS_CATALOG.map((book, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Book',
        name: book.title,
        datePublished: String(book.year),
        inLanguage: 'pt-BR',
        genre: 'Literatura Juvenil',
        numberOfPages: book.pages,
        publisher: {
          '@type': 'Organization',
          name: book.publisher || 'Editora Rocco',
        },
        author: {
          '@id': 'https://thalitareboucas.com.br/#author',
        },
        abstract: book.synopsis,
      },
    })),
  };

  const moviesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Filmografia e Adaptações de Thalita Rebouças',
    description: 'Filmes campeões de bilheteria e streaming adaptados das obras de Thalita Rebouças.',
    numberOfItems: MOVIES_CATALOG.length,
    itemListElement: MOVIES_CATALOG.map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        datePublished: String(movie.year),
        director: {
          '@type': 'Person',
          name: movie.director,
        },
        actor: movie.cast.map((actorName) => ({
          '@type': 'Person',
          name: actorName,
        })),
        author: {
          '@id': 'https://thalitareboucas.com.br/#author',
        },
        description: movie.synopsis,
        duration: movie.duration,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(booksSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(moviesSchema) }}
      />
    </>
  );
};

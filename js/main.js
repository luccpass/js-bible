const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik1vbiBNYXkgMDEgMjAyMyAyMzozMzoxNSBHTVQrMDAwMC5sdWthc3Bhc3M5OEBnbWFpbC5jb20iLCJpYXQiOjE2ODI5ODM5OTV9.cmf3IeJ-HwRzwKFQF3C4lwTADSCCoQLt6sp-XXr6nZw'
const bookContainer = document.querySelector('#book-container')

const $verses = document.querySelector('.verses')

const cleanScreen = () => {
    $verses.innerHTML = ''
}

function bookBoxCreator(chapterBook, lengthBook, abbrev) {

    const bookBox = document.createElement('div');
    bookBox.classList.add('book-box');
    bookBox.setAttribute('id', abbrev)
  
    const titleContent = document.createElement('div');
    titleContent.classList.add('title-content');
    const spanTextTitle = document.createElement('span');
    spanTextTitle.textContent = chapterBook;
    titleContent.appendChild(spanTextTitle);
  
    const chapter = document.createElement('div');
    chapter.classList.add('chapters');

    const ul = document.createElement('ul');

    // Funcao onde cria a ul
    const createLi = (chapter) => {
        const li = document.createElement('li');
        li.textContent = chapter;

        li.onclick = () => {
            cleanScreen()
            const chapter = li.textContent
            const fatherElement = li.parentNode.parentNode.parentNode
            const abbrev = fatherElement.id

            criaConteudo(abbrev, chapter)
        }
      
        ul.appendChild(li);
        return ul
    }
    
  
    const arrowLeftButton = document.createElement('div');
    arrowLeftButton.classList.add('icon', 'left');
    const arrowLeftIcon = document.createElement('i');
    arrowLeftIcon.classList.add('fa-solid', 'fa-angle-left');
    arrowLeftButton.appendChild(arrowLeftIcon);
  
    const arrowRightButton = document.createElement('div');
    arrowRightButton.classList.add('icon', 'right');
    const arrowRightIcon = document.createElement('i');
    arrowRightIcon.classList.add('fa-solid', 'fa-angle-right');
    arrowRightButton.appendChild(arrowRightIcon);
  
    
    bookBox.appendChild(titleContent);
    bookBox.appendChild(chapter);
    
    chapter.appendChild(arrowLeftButton);
    //chapter.appendChild(createLi(1));
    chapter.appendChild(arrowRightButton);

    for (let i = 1; i <= lengthBook; i++) {
        chapter.appendChild(createLi(i))
    }

    arrowRightButton.onclick = () => {
        ul.scrollLeft += 100
        console.log('Eu fui para esquerda e Cristo me mandou para DIREITA')
    }

    arrowLeftButton.onclick = () => {
        ul.scrollLeft -= 100
        console.log('Eu fui para direita e Cristo me empurrou para a ESQUERDA')
    }


    return bookBox;
} 



const getBible = async (parameter) => {
    
    const response = await fetch(`https://www.abibliadigital.com.br/api/${parameter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      return data
}


const putBooksAndChapterInScreen = async (parameter) => {
    const data = await getBible('books')
    
    data.forEach(element => {
        const chapterBook = element.name
        const lengthBook = element.chapters
        const abbrevClass = element.abbrev.pt
        bookContainer.appendChild(bookBoxCreator(chapterBook, lengthBook, abbrevClass))
    });
}


const getBook = async (abbrev, chapter) => {
    const book = await getBible(`verses/acf/${abbrev}/${chapter}`)
    return book
}


const criaConteudo = async (abbrev, chapter) => {
    const book = await getBook(abbrev, chapter)

    const h1 = document.querySelector('.book h1')
    const h2 = document.querySelector('.book h2')

    const bookVerses = book.verses
    const booktitle = book['book']['name']
    const chapterNumber = book.chapter.number

    h1.textContent = ''
    h2.textContent = ''
    
    h1.textContent = booktitle.toUpperCase()
    h2.textContent = chapterNumber

    const criaP = (content, sp) => {
        const p = document.createElement('p')
        p.innerHTML = `<sup>${sp}</sup> ${content}`
        $verses.appendChild(p)
    }

    bookVerses.forEach(element => {
        const verse = element.text
        const verseNumber = element.number
        criaP(verse, verseNumber)
    })
}


putBooksAndChapterInScreen()
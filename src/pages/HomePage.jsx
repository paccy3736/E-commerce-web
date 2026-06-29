import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getCategories, getProducts } from '../services/ecommerce'
import { getProductImageUrl } from '../utils/images'

function HomePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 20 }),
  })

  const { data: productsData, isLoading, error, isFetching } = useQuery({
    queryKey: ['products', { category, page, search }],
    queryFn: () =>
      getProducts({
        page,
        limit: 8,
        search: search || undefined,
        category: category === 'all' ? undefined : category,
      }),
    keepPreviousData: true,
  })

  const categories = useMemo(() => categoriesData?.data ?? [], [categoriesData])
  const products = useMemo(() => productsData?.data?.all ?? [], [productsData])
  const pagination = productsData?.pagination

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-sky-500 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-100">Fresh picks</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Discover curated products from our live catalog.</h2>
        <p className="mt-3 max-w-2xl text-sm text-violet-50 sm:text-base">
          Search, filter, and browse products from the real API while keeping the experience polished and responsive.
        </p>
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold">Filters</h3>
            {categoriesError && (
              <span className="text-xs text-rose-600 block">Unable to load categories.</span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4 sm:flex-row md:justify-end md:max-w-2xl">
            <div className="flex-1">
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search products..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="sm:w-56">
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value)
                  setPage(1)
                }}
                disabled={categoriesLoading}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
              >
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </aside>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Products</h3>
            <p className="text-sm text-slate-500">Showing {products.length} results</p>
          </div>
          {isFetching && <span className="text-sm text-violet-600">Refreshing…</span>}
        </div>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-32 rounded-2xl bg-slate-200" />
                <div className="mt-4 h-4 w-24 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-20 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            The catalog could not be loaded from the live API. Please try again shortly.
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No products match your current filters. Try another search or category.
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const imageUrl = getProductImageUrl(product)
              return (
                <article key={product.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="mb-4 h-36 w-full rounded-2xl object-cover"
                  />
                  <p className="text-sm font-medium text-violet-600">{product.category?.name || 'General'}</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h4>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">{product.description || 'A great product from the live catalog.'}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-900">${product.price}</span>
                    <Link to={`/products/${product.id}`} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                      View details
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50">
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {pagination.page} of {pagination.pages}</span>
            <button type="button" onClick={() => setPage((current) => current + 1)} disabled={page >= pagination.pages} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
